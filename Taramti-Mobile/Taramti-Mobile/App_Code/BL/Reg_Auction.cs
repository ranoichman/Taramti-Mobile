using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Reg_Auction : Auction
{
    //fields
     Money_Bid[] money_Bids;

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
    #endregion

    //ctor
    public Reg_Auction()
    {

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
    #endregion


}
