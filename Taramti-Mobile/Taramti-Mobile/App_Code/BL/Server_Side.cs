using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
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

        string StrSql = @"SELECT        dbo.auction.auction_code, dbo.auction.start_date, dbo.auction.end_date, dbo.auction.product_code, dbo.auction.seller_id, dbo.auction.buyer_id, dbo.auction.final_price, dbo.auction.donation_percentage, 
                         dbo.auction.association_code, dbo.auction.score, MAX(dbo.bid.bid_code) AS Max
                        FROM            dbo.auction LEFT OUTER JOIN
                                                 dbo.bid ON dbo.auction.auction_code = dbo.bid.auction_code
                        GROUP BY dbo.auction.auction_code, dbo.auction.start_date, dbo.auction.end_date, dbo.auction.product_code, dbo.auction.seller_id, dbo.auction.buyer_id, dbo.auction.final_price, dbo.auction.donation_percentage, 
                                                 dbo.auction.association_code, dbo.auction.score
                        HAVING        (dbo.auction.end_date <= CONVERT(VARCHAR(10), '@date', 110)) AND (dbo.auction.buyer_id IS NULL)";
        SqlParameter parDate = new SqlParameter("@date", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parDate);

        foreach (DataRow row in DS.Tables[0].Rows)
        {
            string sql = @"SELECT        buyer_id, bid_code, auction_code FROM dbo.bid where auction_code = @auc and bid_code=@bid ";
            SqlParameter parauc = new SqlParameter("@auc",row["auction_code"]);
            SqlParameter parbid = new SqlParameter("@bid", row["bid_code"]);
            StrSql = @"Insert into dbo.auction(buyer_id,final_price,score) values()";
            db.ExecuteQuery(StrSql);
        }

    }
}