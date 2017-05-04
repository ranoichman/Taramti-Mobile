using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Item_Auction : Auction
{
    //fields
     int donation_Amount;
     int max_Number_Of_Items;
     Item_Bid[] item_Bids;
    
    //props
    #region
    public int Donation_Amount
    {
        get
        {
            return donation_Amount;
        }

        set
        {
            donation_Amount = value;
        }
    }

    public int Max_Number_Of_Items
    {
        get
        {
            return max_Number_Of_Items;
        }

        set
        {
            max_Number_Of_Items = value;
        }
    }

    public Item_Bid[] Item_Bids
    {
        get
        {
            return item_Bids;
        }

        set
        {
            item_Bids = value;
        }
    }
    #endregion


    //ctor
    public Item_Auction()
    {

    }

    //methods
    #region
    public override void PostBid()
    {
        throw new System.Exception("Not implemented");
    }
    public void ChooseWinningItem()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowItemDetails()
    {
        throw new System.Exception("Not implemented");
    }
    public void SendMessage()
    {
        throw new System.Exception("Not implemented");
    }

    public override int CalculateUserScore()
    {
        throw new NotImplementedException();
    }
    #endregion


}
