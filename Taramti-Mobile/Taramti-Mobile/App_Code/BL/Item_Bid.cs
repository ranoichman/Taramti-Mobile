using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Item_Bid : Bid
{
    //fields
     Item_Auction item_Auction;
     Item item;

    //props
    #region
    public Item_Auction Item_Auction
    {
        get
        {
            return item_Auction;
        }

        set
        {
            item_Auction = value;
        }
    }

    public Item Item
    {
        get
        {
            return item;
        }

        set
        {
            item = value;
        }
    }
    #endregion
    
    //ctor
    public Item_Bid()
    {

    }

    //methods
    #region
    public void GetItemDetails()
    {
        throw new System.Exception("Not implemented");
    }
    #endregion

}
