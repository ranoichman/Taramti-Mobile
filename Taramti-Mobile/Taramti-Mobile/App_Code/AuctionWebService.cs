using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for AuctionWebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class AuctionWebService : System.Web.Services.WebService
{

    public AuctionWebService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod (Description = "מתודה להבאת מכרזים על פי פרמטרים")]
    public string GetAuctionByParam(int[] cities, int lowPrice, int highPrice, int catCode)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Reg_Auction.GetAuctionsByParam(cities, lowPrice, highPrice, catCode));
    }

    [WebMethod (Description = "מתודה להבאת ביד אחרון בהינתן מספר אוקשן")]
    public string GetAuctionPrice(int auctionCode)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Reg_Auction auction = new Reg_Auction();
        auction.AuctionID = auctionCode;
        return j.Serialize(auction.GetLatestBid());
    }

    [WebMethod (Description = "הבאת כל קטגוריות המוצרים")]
    public string GetAllProductsCategories()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Reg_Auction auction = new Reg_Auction();
        return j.Serialize(auction.GetAllProductsCategories());
    }

    [WebMethod (Description = "הצעת ביד")]
    public bool OfferBid(int auc, int bid, int buyer)
    {
        //JavaScriptSerializer j = new JavaScriptSerializer();
        Reg_Auction auction = new Reg_Auction();
        return auction.OfferBid(auc,bid,buyer);
    }

    [WebMethod]
    public string AddingProductAuction(string[] Arr, string itemName, string itemDesc, string city, string cat, string days, string assoc, string price)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Item NewItem = new Item();
        City c = new City(int.Parse(city));
        Item_Category IC = new Item_Category(int.Parse(cat));
        NewItem.Pictures = Arr;
        NewItem.ItemName = itemName;
        NewItem.ItemDesc = itemDesc;
        NewItem.Location = c;
        NewItem.Item_Categories = IC;
        return j.Serialize(NewItem.AddPictures());

    }
}
