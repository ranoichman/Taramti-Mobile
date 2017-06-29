using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Bid
/// </summary>
public abstract class Bid
{
    //fields
     int id;
     DateTime dateTime;
     UserT buyer;

    //props
    #region
    public int Id
    {
        get
        {
            return id;
        }

        set
        {
            id = value;
        }
    }

    public DateTime DateTime
    {
        get
        {
            return dateTime;
        }

        set
        {
            dateTime = value;
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
    #endregion

    //ctor
    public Bid()
    {

    }

    //methods
    #region
    public DataTable GetBidDetails(int aucId)
    {
        throw new System.Exception("Not implemented");
    }
    #endregion
}