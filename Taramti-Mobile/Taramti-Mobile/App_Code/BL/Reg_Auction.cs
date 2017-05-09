using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Reg_Auction : Auction
{
    //fields
     Money_Bid[] money_Bids;
    int price;

    //props
    #region
    public Money_Bid[] Money_Bids
    {
        get
        {
            return money_Bids;
        }

        set
        {
            money_Bids = value;
        }
    }

    public int Price
    {
        get
        {
            return price;
        }

        set
        {
            price = value;
        }
    }
    #endregion

    //ctor
    public Reg_Auction()
    {

    }

    public Reg_Auction(int aucID)
    {
        AuctionID = aucID;
       
    }

    //methods
    #region
    public void postBid() { }

    //מתודה לחישוב הביד הזוכה
    public Money_Bid calcWinningBid()
    {
        int max = 0;
        Money_Bid winning = new Money_Bid();
        foreach (Money_Bid bid in money_Bids)
        {
            if (max>bid.GetBidAmount())
            {
                max = bid.GetBidAmount();
                winning = bid;
            }
        }
        
        return winning;
    }

    public override int CalculateUserScore()
    {
        return 0;
    }

    public static List<Reg_Auction> GetAuctionsByParam(int[] cities, int lowPrice, int highPrice, int catCode)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        DataSet DSprice = new DataSet();
        DataSet DSpic = new DataSet();

        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();
        int low = 0;
        int high = 0;
        string code = "";
        if (lowPrice == -1)
            low = 0;
        else
            low = lowPrice;
        if (highPrice == -1)
            high = 1000000;
        else
            high = highPrice;
        if (catCode == 0)
            code = "> 0";
        else
            code = "=" + catCode;


        string StrSql = "SELECT dbo.auction.auction_code, dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, " +
                         "dbo.product.product_Name, dbo.product.product_category_code, dbo.product.price, dbo.product.product_code " +
                         "FROM  dbo.auction INNER JOIN dbo.product ON dbo.auction.product_code = dbo.product.product_code " +
                         "INNER JOIN dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code " +
                         "GROUP BY dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_category_code, " +
                         "dbo.auction.auction_code, dbo.product.price,dbo.product.product_code,dbo.product.product_Name ";

        StrSql += "HAVING (dbo.product.price BETWEEN " + low + " AND " + high + " and dbo.product.product_category_code " + code + " and dbo.auction.end_date > CONVERT(DATETIME, '" + DateTime.Now.ToString("yyyy-MM-dd 00:00:00") + "', 102)) ";

        DS = db.GetDataSetByQuery(StrSql);
        if (DS.Tables.Count > 0)
        {
            // נבדוק האם יש למכרז בידים, אם כן נציג את הביד הגבוה, אם לא נביא את המחיר ההתחלתי שלו
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                Reg_Auction auction = new Reg_Auction(int.Parse(row[0].ToString()));
                List<string> images = new List<string>();
                StrSql = @"SELECT dbo.auction.auction_code, MAX(dbo.bid.price) AS Expr1
                         FROM dbo.bid INNER JOIN
                         dbo.auction ON dbo.bid.auction_code = dbo.auction.auction_code
                         GROUP BY dbo.auction.auction_code
                         HAVING  (dbo.auction.auction_code = " + auction.AuctionID.ToString()   + ")";
                DSprice = db.GetDataSetByQuery(StrSql);

                if (DSprice.Tables[0].Rows.Count > 0)
                {
                    auction.Price = int.Parse(DSprice.Tables[0].Rows[0][1].ToString());
                }
                else
                {
                    auction.Price = int.Parse(row[8].ToString());
                }

                StrSql = "SELECT dbo.product_pictures.path " +
                         "FROM dbo.product_pictures INNER JOIN " +
                         "dbo.product ON dbo.product_pictures.product_code = dbo.product.product_code " +
                         "WHERE(dbo.product_pictures.product_code = " + row[9].ToString() + ") ";
                DSpic = db.GetDataSetByQuery(StrSql);
                if (DSpic.Tables.Count > 0 )
                {
                    foreach (DataRow img in DSpic.Tables[0].Rows)
                    {
                        images.Add(img[0].ToString());
                    }
                }
                auction.CatDesc = row[2].ToString();
                //DateTime G = DateTime.Parse(row[3].ToString());
                //string ng = G.ToString("MM/dd/yyyy HH:mm:ss");
                //auction.End_Date = DateTime.Parse(ng);
                auction.End_Date = row[3].ToString();
                auction.Percentage = int.Parse(row[4].ToString());
                auction.ProdDesc = row[5].ToString();
                auction.ProdName = row[6].ToString();
                auction.ItemCode = int.Parse(row[7].ToString());
                auction.Images = images.Count > 0 ? images.ToArray() : null;

                relevantAuctions.Add(auction);
            }
        }

        return relevantAuctions;
    }

    public int GetLatestBid()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();

        string StrSql = "SELECT auction_code, MAX(price) AS Maximum " +
                        "FROM dbo.bid " +
                        "GROUP BY auction_code " +
                        "HAVING(auction_code = " + AuctionID + ") ";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables[0].Rows.Count > 0 )
        {
            return int.Parse(DS.Tables[0].Rows[0][1].ToString());
        }
        else
        {
            return -1;
        }
    }

    public List<Item_Category> GetAllProductsCategories()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Item_Category> allCat = new List<Item_Category>();
        string StrSql = "SELECT * FROM product_category order by category_name ";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables.Count > 0)
        {
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                Item_Category Item = new Item_Category();
                Item.Cat_id = int.Parse(row[0].ToString());
                Item.Cat_Name = row[1].ToString();
                allCat.Add(Item);
            }
        }
        return allCat;
    }

    public bool OfferBid(int auc, int bid, int buyer)
    {
        DbService db = new DbService();
        string sqlInsert = @"INSERT INTO [dbo].[bid]
           ([auction_code]
           ,[bid_code]
           ,[bid_time]
           ,[buyer_id]
           ,[price])
     VALUES
           (@auc, @bidCode,@bidTime,@buyer,@price) ";

        SqlParameter parauc = new SqlParameter("@auc", auc);
        SqlParameter parbid = new SqlParameter("@bidCode", bid);
        SqlParameter partime = new SqlParameter("@bidTime", DateTime.Now);
        SqlParameter parbuy = new SqlParameter("@buyer", buyer);
        SqlParameter parprice = new SqlParameter("@price", bid);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parauc, parbid, partime, parbuy, parprice) == 0)
        {
            return false;
        }
        return true;

    }

    public bool AddNewAuction(int prod, int assoc)
    {
        DbService db = new DbService();
        string sqlInsert = @"INSERT INTO[dbo].[auction]
           ([start_date]
           ,[end_date]
           ,[product_code]
           ,[seller_id]
           ,[donation_percentage]
           ,[association_code])
     VALUES
           (@parStart, @parEnd,@parCode,@parSeller,@parPercent, @parAssoCode) ";
        Random rnd = new Random();
        
        int n = rnd.Next(15, 30);
        SqlParameter parStart = new SqlParameter("@parStart", DateTime.Now);
        SqlParameter parEnd = new SqlParameter("@parEnd", End_Date);
        SqlParameter parCode = new SqlParameter("@parCode", prod);
        SqlParameter parSeller = new SqlParameter("@parSeller", Seller.UserId);
        SqlParameter parPercent = new SqlParameter("@parPercent", n);
        SqlParameter parAssoCode = new SqlParameter("@parAssoCode", assoc);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parStart, parEnd, parCode, parSeller, parPercent, parAssoCode) == 0)
        {
            return false;
        }
        return true;

    }
    #endregion


}
