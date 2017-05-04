using System;
using System.Collections.Generic;
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

    //methods
    #region
        //פונקציה שמחזירה את סכום הביד
    public int GetBidAmount()
    {
        return Amount;
    }
    #endregion

}
