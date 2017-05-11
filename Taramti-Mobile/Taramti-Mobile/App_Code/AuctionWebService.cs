using System;
using System.Collections.Generic;
using System.Data;
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
    public string AddingProductAuction( string itemName, string itemDesc, string city, string cat, string days, string assoc, string price, string user)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        JavaScriptSerializer j = new JavaScriptSerializer();
        Item NewItem = new Item();
        Reg_Auction Auction = new Reg_Auction();
        City c = new City(int.Parse(city));
        Item_Category IC = new Item_Category(int.Parse(cat));
        Voluntary_association Vol = new Voluntary_association(assoc);
        UserT Seller = new UserT(user,true);
        int ProductCode = 0;
        
        NewItem.ItemName = itemName;
        NewItem.ItemDesc = itemDesc;
        NewItem.Location = c;
        NewItem.Item_Categories = IC;

        Auction.End_Date = DateTime.Now.AddDays(double.Parse(days)).ToString();
        Auction.Vol_asc = Vol;
        Auction.Price = int.Parse(price);
        Auction.Seller = Seller;

        NewItem.AddItem(int.Parse(Auction.Seller.UserId));

        string StrSql = "select max(product_code) from product ";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables.Count > 0)
        {
            ProductCode = int.Parse(DS.Tables[0].Rows[0][0].ToString());
        }

        Auction.AddNewAuction(ProductCode, int.Parse(assoc));

        return j.Serialize(ProductCode);

    }

    public string AddingProductPictures(string[] Arr, int itemId)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Item NewItem = new Item();
        NewItem.ItemId = itemId;
        NewItem.Pictures = Arr;
        return j.Serialize(NewItem.AddPictures());
    }

}
