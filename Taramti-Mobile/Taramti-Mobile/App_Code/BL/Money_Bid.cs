using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Money_Bid : Bid
{
    //fields
    Reg_Auction r_Auction;
    int amount;

    //props
    #region
    public Reg_Auction R_Auction
    {
        get
        {
            return r_Auction;
        }

        set
        {
            r_Auction = value;
        }
    }

    public int Amount
    {
        get
        {
            return amount;
        }

        set
        {
            amount = value;
        }
    }
    #endregion

    //ctor
    public Money_Bid()
    {

    }

    public Money_Bid(Reg_Auction auc, int amount)
    {
        R_Auction = auc;
        Amount = amount;
    }
    //methods
    #region
    //פונקציה שמחזירה את סכום הביד
    public int GetBidAmount()
    {
        return Amount;
    }

    public Money_Bid GetBidDetails(int aucId)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        //List<Money_Bid> Bid = new List<Money_Bid>();
        string StrSql = "select * from [dbo].[bid] where [auction_code] = @auc and [bid_code] = @bid ";
        SqlParameter parAuc = new SqlParameter("@auc", R_Auction.AuctionID);
        SqlParameter parBid = new SqlParameter("@bid", Amount);
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parAuc, parBid);
        if (DS.Tables[0].Rows.Count > 0)
        {
            Money_Bid Bid = new Money_Bid();
            UserT U = new UserT();
            U.UserId = DS.Tables[0].Rows[0]["buyer_id"].ToString();
            Bid.Buyer = U;
            Bid.Id = Amount;
            Bid.R_Auction = R_Auction;
            return Bid;
        }
        throw new System.Exception("Not implemented");
    }
    #endregion

}
