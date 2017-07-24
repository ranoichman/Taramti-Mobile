using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

/// <summary>
/// Summary description for Server_Side
/// </summary>
public class Server_Side
{
    public Server_Side()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    // הפונקציה דוגמת את בסיס הנתונים ומעדכנת את המכרזים שנגמרו בביד הזוכה ובתז של הזוכה
    public void CloseAuctions()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        DataSet Results = new DataSet();

        string StrSql = @"SELECT        dbo.auction.auction_code, dbo.auction.start_date, dbo.auction.end_date, dbo.auction.product_code, dbo.auction.seller_id, dbo.auction.buyer_id, dbo.auction.final_price, dbo.auction.donation_percentage, 
                         dbo.auction.association_code, dbo.auction.score, MAX(dbo.bid.bid_code) AS Max
                        FROM            dbo.auction LEFT OUTER JOIN
                                                 dbo.bid ON dbo.auction.auction_code = dbo.bid.auction_code
                        GROUP BY dbo.auction.auction_code, dbo.auction.start_date, dbo.auction.end_date, dbo.auction.product_code, dbo.auction.seller_id, dbo.auction.buyer_id, dbo.auction.final_price, dbo.auction.donation_percentage, 
                                                 dbo.auction.association_code, dbo.auction.score
                        HAVING        (dbo.auction.end_date <= CONVERT(datetime, @date, 110)) AND (dbo.auction.buyer_id IS NULL)";
        SqlParameter parDate = new SqlParameter("@date", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parDate);

        foreach (DataRow row in DS.Tables[0].Rows)
        {
            if (row["Max"] != DBNull.Value)
            {
                DbService dbs = new DbService();
                string sql = @"SELECT buyer_id, bid_code FROM dbo.bid where auction_code = @auc and bid_code=@bid ";
                SqlParameter parauc = new SqlParameter("@auc", row["auction_code"]);
                SqlParameter parbid = new SqlParameter("@bid", row["Max"]);
                Results = dbs.GetDataSetByQuery(sql, CommandType.Text, parauc, parbid);

                StrSql = @"update dbo.auction set buyer_id = @buy,final_price = @fin where auction_code = @auc";
                SqlParameter parbuy = new SqlParameter("@buy", Results.Tables[0].Rows[0]["buyer_id"]);
                SqlParameter parfin = new SqlParameter("@fin", Results.Tables[0].Rows[0]["bid_code"]);
                dbs.ExecuteQuery(StrSql, CommandType.Text, parbuy, parfin, parauc);

                // שליחת פוש לזוכה ולמוכר!
                Reg_Auction R = new Reg_Auction(int.Parse(parauc.Value.ToString()));
                R.GetDataByCode();
                WebService Push = new WebService();
                new Task(() => { Push.SendPush(row["seller_id"].ToString(), "מזל טוב!  ", "   " + R.ProdName + " נמכר בהצלחה. כנס לאפליקציה לפרטים נוספים! "); }).Start();
                new Task(() => { Push.SendPush(parbuy.Value.ToString(), "מזל טוב!  ", "זכית במכרז על ה- " + R.ProdName + ". כנס לאפליקציה לפרטים נוספים "); }).Start();
            }
        }

    }

    // הפונקציה דוגמת את בסיס הנתונים ושולחת התרעות למכרזים שעוד מעט מסתימים
    public void SendPushes()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        DataSet Results = new DataSet();

        string StrSql = @"SELECT        auction_code, start_date, end_date, product_code, seller_id, buyer_id, final_price, donation_percentage, association_code, score
                        FROM            dbo.auction
                        GROUP BY auction_code, start_date, end_date, product_code, seller_id, buyer_id, final_price, donation_percentage, association_code, score,sent_push
                        HAVING        (datediff(minute,[end_date],CONVERT(VARCHAR(23), @date, 120)) between -60 and  0) AND (buyer_id IS NULL) AND (sent_push IS NULL);";
        SqlParameter parDate = new SqlParameter("@date", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parDate);

        foreach (DataRow row in DS.Tables[0].Rows)
        {
            DbService dbs = new DbService();
            // נביא את הביד שאחרי הביד המוביל כדי לשלוח לו פוש מדרבן לנסות לעקוף
            string userId = "";
            StrSql = @"SELECT        buyer_id AS buyer, bid_code, auction_code
                    FROM            dbo.bid
                    GROUP BY buyer_id, bid_code, auction_code
                    HAVING       (auction_code = @auc)
                    ORDER BY bid_code DESC";
            SqlParameter parauc = new SqlParameter("@auc", row["auction_code"]);
            Results = dbs.GetDataSetByQuery(StrSql, CommandType.Text, parauc);
            if (Results.Tables[0].Rows.Count > 1) // נבדוק גדול מ - 1 ולא מ - 0 כי אנחנו צריכים לפחות 2 שורות כדי לא לשלוח פוש ליחיד שכן נתן הצעה
            {
                WebService Push = new WebService();
                userId = Results.Tables[0].Rows[1]["buyer"].ToString();
                Reg_Auction R = new Reg_Auction(int.Parse(parauc.Value.ToString()));
                R.GetDataByCode();
                // שליחת פוש ליוזר
                new Task(() => { Push.SendPush(userId, "המכרז על " +  R.ProdName + " בסכנה! ", " המכרז עומד להיגמר ואתה לא המנצח! הצע הצעה מהר כד לזכות במוצר"); }).Start();

                // עדכון הטבלה שלא נשלח למכרז הזה עוד פושים
                StrSql = @"update dbo.auction set [sent_push] = 1 where auction_code = @auc";
                dbs.ExecuteQuery(StrSql, CommandType.Text, parauc);
            }
        }
    }
}