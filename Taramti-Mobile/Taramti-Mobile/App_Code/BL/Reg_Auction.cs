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

    //מתודה לחישוב הביד הזוכה
    public Money_Bid calcWinningBid()
    {
        int max = 0;
        Money_Bid winning = new Money_Bid();
        foreach (Money_Bid bid in money_Bids)
        {
            if (max > bid.GetBidAmount())
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

    public static List<Reg_Auction> GetAuctionsByParam(int lowPrice, int highPrice, int catCode, int assocTagCode, double lat, double lng, int radius, int user_Id)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        DataSet DSprice = new DataSet();
        DataSet DSpic = new DataSet();

        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();
        int low = 0;
        int high = 0;
        string code = "";
        string tagCode = "";
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
        if (assocTagCode == 0)
            tagCode = "> 0";
        else
            tagCode = "=" + assocTagCode;

        //string StrSql = @"SELECT        dbo.auction.auction_code, dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, 
        //                 dbo.product.product_Name, dbo.product.product_category_code, dbo.product.price as NewPrice, dbo.product.product_code as product_code, dbo.product.city_code, dbo.auction.buyer_id
        //                 FROM            dbo.auction INNER JOIN
        //                 dbo.product ON dbo.auction.product_code = dbo.product.product_code INNER JOIN
        //                 dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code LEFT OUTTER JOIN
        //                 dbo.tag_of_association ON dbo.auction.association_code = dbo.tag_of_association.association_code
        //                 GROUP BY dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_category_code, 
        //                 dbo.auction.auction_code, dbo.product.price, dbo.product.product_code, dbo.product.product_Name, dbo.product.city_code, dbo.auction.seller_id, dbo.auction.buyer_id ";
        string StrSql = @"SELECT   DISTINCT      dbo.auction.auction_code, dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, 
                         dbo.product.product_Name, dbo.product.product_category_code, dbo.product.price AS NewPrice, dbo.product.product_code, dbo.product.city_code, dbo.auction.buyer_id
                         FROM            dbo.auction LEFT OUTER JOIN
                         dbo.product ON dbo.auction.product_code = dbo.product.product_code LEFT OUTER JOIN
                         dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code LEFT OUTER JOIN
                         dbo.tag_of_association ON dbo.auction.association_code = dbo.tag_of_association.association_code
                         GROUP BY dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_category_code, 
                         dbo.auction.auction_code, dbo.product.price, dbo.product.product_code, dbo.product.product_Name, dbo.product.city_code, dbo.auction.seller_id, dbo.auction.buyer_id,dbo.tag_of_association.tag_code ";

        StrSql += "HAVING (dbo.product.price BETWEEN " + low + " AND " + high + " and dbo.product.product_category_code " + code + " and tag_code " + tagCode + " and dbo.auction.end_date > CONVERT(DATETIME, '" + DateTime.Now.ToString("yyyy-MM-dd 00:00:00") + "', 102)) " +
                  "AND (dbo.auction.seller_id <> N'" + user_Id + "') ";

        DS = db.GetDataSetByQuery(StrSql);


        if (!(lat == 0 & lng == 0 & radius == 0 & lowPrice == -1 & highPrice == -1 & catCode == 0))
        {
            AddNewSearch(user_Id, lat, lng, radius, lowPrice, highPrice, catCode, assocTagCode);
        }

        // הפונקציה תקבל את כל המכרזים ומחיר תקרה
        return GetRelevantAuctions(DS, high);
    }

    private static List<Reg_Auction> GetRelevantAuctions(DataSet DS, int high)
    {
        DbService db = new DbService();
        DataSet DSprice = new DataSet();
        DataSet DSpic = new DataSet();
        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();

        if (DS.Tables.Count > 0)
        {
            // נבדוק האם יש למכרז בידים, אם כן נציג את הביד הגבוה, אם לא נביא את המחיר ההתחלתי שלו
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                bool b = true; // כדי לדעת מה המצב עם מחיר הבידים - אם הם גבוהים מהמחיר בטווח 
                Reg_Auction auction = new Reg_Auction(int.Parse(row["auction_code"].ToString()));
                List<string> images = new List<string>();
                string StrSql = @"SELECT dbo.auction.auction_code, MAX(dbo.bid.price) AS price
                         FROM dbo.bid INNER JOIN
                         dbo.auction ON dbo.bid.auction_code = dbo.auction.auction_code
                         GROUP BY dbo.auction.auction_code
                         HAVING  (dbo.auction.auction_code = " + auction.AuctionID.ToString() + ")";
                DSprice = db.GetDataSetByQuery(StrSql);

                if (DSprice.Tables[0].Rows.Count > 0)
                {
                    if (int.Parse(DSprice.Tables[0].Rows[0]["price"].ToString()) > high)
                    {
                        b = false;
                    }
                    else
                    {
                        auction.Price = int.Parse(DSprice.Tables[0].Rows[0]["price"].ToString());
                    }

                }
                else
                {
                    auction.Price = int.Parse(row["price"].ToString());
                }

                StrSql = "SELECT dbo.product_pictures.path " +
                         "FROM dbo.product_pictures INNER JOIN " +
                         "dbo.product ON dbo.product_pictures.product_code = dbo.product.product_code " +
                         "WHERE(dbo.product_pictures.product_code = " + row["product_code"].ToString() + ") ";
                DSpic = db.GetDataSetByQuery(StrSql);
                if (DSpic.Tables.Count > 0)
                {
                    foreach (DataRow img in DSpic.Tables[0].Rows)
                    {
                        images.Add(img["path"].ToString());
                    }
                }
                auction.CatDesc = row["category_name"].ToString();
                //DateTime G = DateTime.Parse(row[3].ToString());
                //string ng = G.ToString("MM/dd/yyyy HH:mm:ss");
                //auction.End_Date = DateTime.Parse(ng);
                auction.Location = new City(int.Parse(row["city_code"].ToString()));
                auction.End_Date = row["end_date"].ToString();
                auction.Percentage = int.Parse(row["donation_percentage"].ToString());
                auction.ProdDesc = row["product_description"].ToString();
                auction.ProdName = row["product_Name"].ToString();
                if (row["buyer_id"].ToString() != "")
                {
                    auction.Buyer = new UserT(row["buyer_id"].ToString());
                }
                auction.ItemCode = int.Parse(row["product_code"].ToString());
                auction.Images = images.Count > 0 ? images.ToArray() : null;

                if (b)
                {
                    relevantAuctions.Add(auction);
                }
            }
        }
        return relevantAuctions;
    }

    public static void AddNewSearch(int id, double lat, double lng, int radius, int lowPrice, int highPrice, int catCode, int assocTagCode)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();

        string StrSql = @"INSERT INTO [dbo].[search_log] ([search_time] ,[user_id] ,[user_lat] ,[user_lng] ,[radius] ,[low_price],[high_price],[cat_code],[Assoc_Cat_Code])
            VALUES (@time, @id,@lat,@lng,@radius,@lowprice, @highprice,@cat,@tag) ";

        SqlParameter parTime = new SqlParameter("@time", DateTime.Now);
        SqlParameter parId = new SqlParameter("@id", id);
        SqlParameter parLat = new SqlParameter("@lat", lat);
        SqlParameter parLng = new SqlParameter("@lng", lng);
        SqlParameter parRadius = new SqlParameter("@radius", radius);
        SqlParameter parLow = new SqlParameter("@lowprice", lowPrice);
        SqlParameter parHigh = new SqlParameter("@highprice", highPrice);
        SqlParameter parCat = new SqlParameter("@cat", catCode);
        SqlParameter parTag = new SqlParameter("@tag", assocTagCode);
        if (db.ExecuteQuery(StrSql, CommandType.Text, parTime, parId, parLat, parLng, parRadius, parLow, parHigh, parCat, parTag) == 0)
        {

        }
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

        if (DS.Tables[0].Rows.Count > 0)
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


    public bool OfferBid(int bid, int buyer)
    {
        DbService db = new DbService();
        string sqlInsert = @"INSERT INTO [dbo].[bid]
           ([auction_code] ,[bid_code] ,[bid_time] ,[buyer_id] ,[price])
            VALUES (@auc, @bidCode,@bidTime,@buyer,@price) ";

        SqlParameter parauc = new SqlParameter("@auc", AuctionID);
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
           ([start_date], [end_date], [product_code], [seller_id], [donation_percentage], [association_code])
            VALUES (@parStart, @parEnd,@parCode,@parSeller,@parPercent, @parAssoCode) ";
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

    public void GetDataByCode()
    {
        string strSql = @"SELECT dbo.auction.auction_code, dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, 
                         dbo.product.product_Name, dbo.product.product_category_code, dbo.product.price, dbo.product.product_code, dbo.auction.seller_id, dbo.product.city_code
                    FROM dbo.auction INNER JOIN  dbo.product
                        ON dbo.auction.product_code = dbo.product.product_code INNER JOIN dbo.product_category
                        ON dbo.product.product_category_code = dbo.product_category.category_code
                    GROUP BY dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_category_code, 
                         dbo.auction.auction_code, dbo.product.price, dbo.product.product_code, dbo.product.product_Name, dbo.auction.seller_id, dbo.product.city_code
                         HAVING (dbo.auction.auction_code = @Code)";
        SqlParameter parCode = new SqlParameter("@Code", AuctionID);
        DbService db = new DbService();
        DataTable dt = new DataTable();
        dt = db.GetDataSetByQuery(strSql, CommandType.Text, parCode).Tables[0];
        DataRow row = dt.Rows[0];

        if (row != null)
        {
            CatDesc = row["category_name"] != null ? row["category_name"].ToString() : "";
            End_Date = row["end_date"] != null ? row["end_date"].ToString() : DateTime.Now.ToString();
            Percentage = row["donation_percentage"] != null ? int.Parse(row["donation_percentage"].ToString()) : 0;
            ProdDesc = row["product_description"] != null ? row["product_description"].ToString() : "";
            ProdName = row["product_Name"] != null ? row["product_Name"].ToString() : "";
            Seller = row["seller_id"] != null ? new UserT(row["seller_id"].ToString()) : new UserT("-1");
            Price = row["price"] != null ? int.Parse(row["price"].ToString()) : -1;
            //get the most updated price
            int tempPrice = GetLatestBid();
            if (tempPrice != -1)
            {
                Price = tempPrice;
            }
            Location = row["city_code"] != null ? new City(int.Parse(row["city_code"].ToString())) : new City(-1);
            Seller.Rank = UserT.GetUserRank(Seller.UserId);



            //getting all product pics
            string picSql = @"SELECT dbo.product_pictures.path
                         FROM dbo.product_pictures INNER JOIN
                         dbo.product ON dbo.product_pictures.product_code = dbo.product.product_code 
                         WHERE(dbo.product_pictures.product_code = @prodCode)";

            SqlParameter parProd = new SqlParameter("@prodCode", row["product_code"].ToString());
            DataSet dsPic = db.GetDataSetByQuery(picSql, CommandType.Text, parProd);

            List<string> pics = new List<string>();
            if (dsPic.Tables.Count > 0)
            {
                foreach (DataRow picRow in dsPic.Tables[0].Rows)
                {
                    pics.Add(picRow["path"].ToString());
                }
            }
            //    ItemCode
            Images = pics.Count > 0 ? pics.ToArray() : null;
        }
    }

    public static List<Reg_Auction> GetOutBiddedAuctions(string user_Id)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();

        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();
        string strSql = @"SELECT DISTINCT 
                         dbo.auction.auction_code, dbo.auction.end_date, dbo.auction.buyer_id, dbo.auction.donation_percentage, dbo.product.product_code, dbo.product.product_description, dbo.product.city_code, dbo.product.product_Name, 
                         dbo.product_category.category_name, dbo.v_leading.price
                         FROM dbo.bid INNER JOIN
                         dbo.v_leading ON dbo.bid.auction_code = dbo.v_leading.auction_code AND dbo.bid.buyer_id <> dbo.v_leading.buyer_id INNER JOIN
                         dbo.auction ON dbo.bid.auction_code = dbo.auction.auction_code INNER JOIN
                         dbo.product ON dbo.auction.product_code = dbo.product.product_code INNER JOIN
                         dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code
                        where (dbo.bid.buyer_id = @userId) AND (dbo.auction.end_date > CONVERT(DATETIME, @date, 102))";

        SqlParameter parId = new SqlParameter("@userId", user_Id);
        SqlParameter parDate = new SqlParameter("@date", DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));

        try
        {
            DS = db.GetDataSetByQuery(strSql, CommandType.Text, parId, parDate);
            return GetRelevantAuctions(DS, 1000000);
        }
        catch (Exception ex)
        {
            return new List<Reg_Auction>();
        }
    }

    /// <summary>
    /// get all auctions (active or history) on a user by id
    /// </summary>
    /// <param name="UserId">buyer id</param>
    /// <param name="caller">the caller function to determine if active or history </param>
    /// <returns></returns>
    public static List<Reg_Auction> Leading(string user_Id, string caller)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();

        string mark = "=";

        if (caller == "current")
        {
            mark = ">";
        }
        else if (caller == "history")
        {
            mark = "<";
        }

        string strSql = @"SELECT dbo.v_leading.auction_code, dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_Name, 
                        dbo.product.product_category_code, dbo.product.product_code, dbo.product.city_code, dbo.auction.buyer_id, dbo.v_leading.price
                        FROM dbo.auction INNER JOIN
                        dbo.product ON dbo.auction.product_code = dbo.product.product_code INNER JOIN
                        dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code INNER JOIN
                        dbo.v_leading ON dbo.auction.auction_code = dbo.v_leading.auction_code
                        GROUP BY dbo.product_category.category_code, dbo.product_category.category_name, dbo.auction.end_date, dbo.auction.donation_percentage, dbo.product.product_description, dbo.product.product_category_code, 
                        dbo.v_leading.auction_code, dbo.product.product_code, dbo.product.product_Name, dbo.product.city_code, dbo.auction.seller_id, dbo.auction.buyer_id, dbo.v_leading.price, dbo.v_leading.buyer_id
                        HAVING (dbo.v_leading.buyer_id = @userId) AND (dbo.auction.end_date " + mark + "CONVERT(DATETIME, @date, 102))";

        SqlParameter parId = new SqlParameter("@userId", user_Id);
        SqlParameter parDate = new SqlParameter("@date", DateTime.Now.ToString("yyyy-MM-dd 00:00:00"));

        try
        {
            DS = db.GetDataSetByQuery(strSql, CommandType.Text, parId, parDate);
            return GetRelevantAuctions(DS, 1000000);
        }
        catch (Exception ex)
        {
            return new List<Reg_Auction>();
        }


    }

    // פונקציה המחזירה את כל המכרזים שאני יצרתי
    public static List<Reg_Auction> GetAllMySells(string user_id)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Reg_Auction> relevantAuctions = new List<Reg_Auction>();

        string StrSql = @"SELECT        TOP (100) PERCENT a.auction_code, dbo.product_category.category_name, dbo.product.product_description, dbo.product.city_code, a.end_date, a.donation_percentage, dbo.product.product_Name, a.buyer_id, 
                         dbo.product.product_code, a.seller_id, dbo.product.price
                         FROM            dbo.auction AS a LEFT OUTER JOIN
                         dbo.product ON a.product_code = dbo.product.product_code LEFT OUTER JOIN
                         dbo.product_category ON dbo.product.product_category_code = dbo.product_category.category_code
                         WHERE        (a.seller_id = @userId)
                         ORDER BY a.product_code, a.end_date";
        SqlParameter parId = new SqlParameter("@userId", user_id);

        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parId);
        try
        {
            int code = 0;
            //   ריצה על כל התוצאות ומחיקת מכרזים ישנים של אותו מוצר - השארת המכרז האחרון למוצר 
            for (int i = DS.Tables[0].Rows.Count - 1; i >= 0; i--)
            {
                DataRow dr = DS.Tables[0].Rows[i];
                if (code == int.Parse(dr["product_code"].ToString()))
                {
                    DS.Tables[0].Rows.Remove(dr);
                }
                else
                {
                    code = int.Parse(dr["product_code"].ToString());
                }
            }
            return GetRelevantAuctions(DS, 1000000);
        }
        catch (Exception ex)
        {
            return new List<Reg_Auction>();
        }
    }



    public void GetItemDetails()
    {

    }




    #endregion


}
