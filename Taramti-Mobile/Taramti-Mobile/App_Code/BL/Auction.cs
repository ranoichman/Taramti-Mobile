using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Auction
/// </summary>
public abstract class Auction
{
    //fields
    int auctionID;
    DateTime start_Date;
    DateTime end_Date;
    Voluntary_association vol_asc;
    UserT seller, buyer;
    int score;
    int itemCode;
    string catDesc;
    string[] images;
    int percentage;
    string desc;


    //props
    #region
    public DateTime Start_Date
    {
        get
        {
            return start_Date;
        }

        set
        {
            start_Date = value;
        }
    }

    public DateTime End_Date
    {
        get
        {
            return end_Date;
        }

        set
        {
            end_Date = value;
        }
    }

    public Voluntary_association Vol_asc
    {
        get
        {
            return vol_asc;
        }

        set
        {
            vol_asc = value;
        }
    }

    public UserT Seller
    {
        get
        {
            return seller;
        }

        set
        {
            seller = value;
        }
    }

    public UserT Buyer
    {
        get
        {
            return buyer;
        }

        set
        {
            buyer = value;
        }
    }

    public int Score
    {
        get
        {
            return score;
        }

        set
        {
            score = value;
        }
    }

    public int AuctionID
    {
        get
        {
            return auctionID;
        }

        set
        {
            auctionID = value;
        }
    }

    public int Percentage
    {
        get
        {
            return percentage;
        }

        set
        {
            percentage = value;
        }
    }

    public string Desc
    {
        get
        {
            return desc;
        }

        set
        {
            desc = value;
        }
    }

    public int ItemCode
    {
        get
        {
            return itemCode;
        }

        set
        {
            itemCode = value;
        }
    }

    public string CatDesc
    {
        get
        {
            return catDesc;
        }

        set
        {
            catDesc = value;
        }
    }

    public string[] Images
    {
        get
        {
            return images;
        }

        set
        {
            images = value;
        }
    }

    #endregion

    //ctor
    public Auction()
    {

    }

    /// <summary>
    /// הבאת כל המכרזים הפעילים
    /// </summary>
    /// <param name="date">תאריך לבדיקה</param>
    /// <returns>תחזיר את כל הקודים של המכרזים הפעילים ואת סכום הביד הנוכחי הגבוה ביותר</returns>
    public static int[] GetAllAuctionsByDates(DateTime date)
    {
        int[] li_rtn = new int[2];
        string sql = @"SELECT ISNULL(dbo.auction.auction_code, - 1) AS auction_code, MAX(ISNULL(dbo.bid.price, 0)) * dbo.auction.donation_percentage / 100 AS maxBid
                        FROM dbo.auction  LEFT OUTER JOIN
                         dbo.bid ON dbo.auction.auction_code = dbo.bid.auction_code
                        GROUP BY dbo.auction.auction_code, dbo.auction.start_date, dbo.auction.end_date, dbo.auction.donation_percentage
                        HAVING        (dbo.auction.start_date <= CONVERT(DATETIME, @date, 102)) AND (dbo.auction.end_date >= CONVERT(DATETIME, @date, 102))";
        SqlParameter parDate = new SqlParameter("@date", date);
        DbService db = new DbService();
        DataTable dt = db.GetDataSetByQuery(sql, CommandType.Text, parDate).Tables[0];

        int count = 0;
        int sum = 0;
        foreach (DataRow row in dt.Rows)
        {
            string code = row["auction_code"].ToString();
            if (code != "-1")
            {
                count++;
                sum += int.Parse(row["maxBid"].ToString());
            }

        }
        li_rtn[0] = count;
        li_rtn[1] = sum;
        return li_rtn;
    }

    /// <summary>
    /// הבאת סך התרומות בין 2 תאריכים
    /// </summary>
    /// <param name="start">תאריך התחלה לבדיקה</param>
    /// <param name="end">תאריך סיום לבדיקה</param>
    /// <returns>תחזיר את הסכום</returns>
    public static int GetDonationSumByDates(DateTime start, DateTime end)
    {
        string sql = @"SELECT SUM(final_price * donation_percentage / 100)  AS donation_sum
                        FROM  dbo.auction
                        WHERE (end_date >= CONVERT(DATETIME, @startDate, 102)) AND (final_price * donation_percentage / 100 > 0) and
                        (end_date <= CONVERT(DATETIME, @endDate, 102))";
        SqlParameter parStart = new SqlParameter("@startDate", start);
        SqlParameter parEnd = new SqlParameter("@endDate", end);
        DbService db = new DbService();
        return db.GetScalarByQuery(sql, CommandType.Text, parStart, parEnd);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="start">תאריך התחלה לבדיקה</param>
    /// <param name="end">תאריך סיום לבדיקה</param>
    /// <returns>תחזיר רשימה של מערכים המכילים שם עמותה, סך הכסף במכרזים וסך התרומות לכל עמותה,</returns>
    public static List<string[]> GetAssocNameTotalSumDonationSumByDates(DateTime start, DateTime end)
    {
        string sql = @"SELECT association_name, sum(final_price) AS total_sum ,SUM(final_price * donation_percentage / 100)  AS donation_sum
                        FROM  dbo.auction, association
						where auction.association_code = association.association_code and (end_date >= CONVERT(DATETIME, @startDate, 102)) AND (final_price * donation_percentage / 100 > 0) and
                        (end_date <= CONVERT(DATETIME, @endDate, 102))
						group by association_name 
order by SUM(final_price * donation_percentage / 100) desc ";
        SqlParameter parStart = new SqlParameter("@startDate", start);
        SqlParameter parEnd = new SqlParameter("@endDate", end);
        DbService db = new DbService();
        DataTable dt = new DataTable();

        try
        {
            dt = db.GetDataSetByQuery(sql, CommandType.Text, parStart, parEnd).Tables[0];

            List<string[]> dlist = new List<string[]>();
            string[] arr = new string[] { "עמותה", "סך הכל לתרומה", "סכום מכרזים" };
            dlist.Add(arr);

            foreach (DataRow row in dt.Rows)
            {
                string asc = row[0].ToString() != null ? row[0].ToString() : "";
                string sum = row[1].ToString() != null ? row[2].ToString() : "";
                string sum2 = row[2].ToString() != null ? row[1].ToString() : "";
                arr = new string[] { asc, sum, sum2 };
                //object obj = new object[row[0].ToString()];

                dlist.Add(arr);
            }

            return dlist;
        }

        catch (Exception ex)
        {
            throw ex;
        }

    }


    //public static List<string[]> GetAssocNameTotalSumDonationSumByDates(DateTime start, DateTime end)
    //{
    //    string sql = @"SELECT association_name, sum(final_price) AS total_sum ,SUM(final_price * donation_percentage / 100)  AS donation_sum
    //                    FROM  dbo.auction, association
				//		where auction.association_code = association.association_code and (end_date >= CONVERT(DATETIME, @startDate, 102)) AND (final_price * donation_percentage / 100 > 0) and
    //                    (end_date <= CONVERT(DATETIME, @endDate, 102))
				//		group by association_name ";
    //    SqlParameter parStart = new SqlParameter("@startDate", start);
    //    SqlParameter parEnd = new SqlParameter("@endDate", end);
    //    DbService db = new DbService();
    //    DataTable dt = new DataTable();

    //    try
    //    {
    //        dt = db.GetDataSetByQuery(sql, CommandType.Text, parStart, parEnd).Tables[0];

    //        List<string[]> dlist = new List<string[]>();
    //        string[] arr = new string[] { "עמותה", "סכום מכרזים", "סך הכל לתרומה" };
    //        dlist.Add(arr);

    //        foreach (DataRow row in dt.Rows)
    //        {
    //            string asc = row[0].ToString() != null ? row[0].ToString() : "";
    //            string sum = row[1].ToString() != null ? row[1].ToString() : "";
    //            string sum2 = row[2].ToString() != null ? row[2].ToString() : "";
    //            arr = new string[] { asc, sum, sum2 };
    //            //object obj = new object[row[0].ToString()];

    //            dlist.Add(arr);
    //        }

    //        return dlist;
    //    }

    //    catch (Exception ex)
    //    {
    //        throw ex;
    //    }

    //}


    //methods
    #region
    public void CalculateAuctionTime()
    {

    }

    public void updateScore()
    {



    }




    public void ShowAuctionQa()
    {
        throw new System.Exception("Not implemented");
    }
    public abstract int CalculateUserScore();

    public void GetAuctionBids()
    {
        throw new System.Exception("Not implemented");
    }
    public virtual void PostBid()
    {
        throw new System.Exception("Not implemented");
    }
    public void GetAuctionUsers()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowAuction()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowSellerScore()
    {
        throw new System.Exception("Not implemented");
    }
    public void SendPush()
    {
        throw new System.Exception("Not implemented");
    }
    public void CreateAuction()
    {
        throw new System.Exception("Not implemented");
    }
    public void GetAuctionCode()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowHighBids()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowAuctionDetails()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowAuctionIMG()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowFAQ()
    {
        throw new System.Exception("Not implemented");
    }
    #endregion



}