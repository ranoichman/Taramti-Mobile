using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Threading.Tasks;

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

    [WebMethod(Description = "מתודה להבאת מכרזים על פי פרמטרים")]
    public string GetAuctionByParam(int lowPrice, int highPrice, int catCode, double lat, double lng, int radius, int user_Id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Reg_Auction.GetAuctionsByParam(lowPrice, highPrice, catCode, lat, lng, radius, user_Id));
    }

    [WebMethod(Description = "מתודה להבאת ביד אחרון בהינתן מספר מכרז")]
    public string GetAuctionPrice(int auctionCode)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Reg_Auction auction = new Reg_Auction();
        auction.AuctionID = auctionCode;
        return j.Serialize(auction.GetLatestBid());
    }

    [WebMethod(Description = "הבאת כל קטגוריות המוצרים")]
    public string GetAllProductsCategories()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Reg_Auction auction = new Reg_Auction();
        return j.Serialize(auction.GetAllProductsCategories());
    }

    [WebMethod(Description = "הצעת ביד")]
    public bool OfferBid(Reg_Auction auc, int bid)
    {
        //Reg_Auction auction = new Reg_Auction();
        bool SendPush = false;
        string PrevBuyerID = "";
        //auction.AuctionID = int.Parse(auc.Buyer.UserId);
        int lastBid = auc.GetLatestBid();
        // אם אין בידים קודמים - לא נשלח פוש לאף אחד
        if (lastBid != -1)
        {
            Money_Bid LastBid = new Money_Bid(auc, lastBid);
            LastBid = LastBid.GetBidDetails(auc.AuctionID);
            PrevBuyerID = LastBid.Buyer.UserId;
            SendPush = true;
        }

        if (lastBid < bid)
        {
            auc.OfferBid(bid, int.Parse(auc.Buyer.UserId.ToString()));
            WebService Push = new WebService();
            // אם יש בידים קודמים, נשלח הודעת פוש למשתמש שנעקף
            if (SendPush)
            {
                //Push.SendPush(PrevBuyerID, "נעקפת!", "אל תפספס את ה " + auction.ProdName + " הצע הצעה חדשה עכשיו!");
                new Task(() => { Push.SendPush(PrevBuyerID, "נעקפת!", "אל תפספס את ה" + auc.ProdName + " הצע הצעה חדשה עכשיו!"); }).Start();   
            }

            return true;
        }
        else
        {
            return false;
        }


    }

    [WebMethod]
    public string AddingProductAuction(string itemName, string itemDesc, string city, string cat, string days, string assoc, string price, string user)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        JavaScriptSerializer j = new JavaScriptSerializer();
        Item NewItem = new Item();
        Reg_Auction Auction = new Reg_Auction();
        City c = new City(int.Parse(city));
        Item_Category IC = new Item_Category(int.Parse(cat));
        Voluntary_association Vol = new Voluntary_association(assoc);
        UserT Seller = new UserT(user, true);
        int ProductCode = 0;

        NewItem.ItemName = itemName;
        NewItem.ItemDesc = itemDesc;
        NewItem.Location = c;
        NewItem.Item_Categories = IC;
        NewItem.Price = price;

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

    [WebMethod]
    public string AddingProductPictures(string[] Arr, int itemId)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Item NewItem = new Item();
        NewItem.ItemId = itemId;
        NewItem.Pictures = Arr;
        return j.Serialize(NewItem.AddPictures());
    }

    [WebMethod(Description ="get all auction details by code")]
    public string GetAuctionByCode(Reg_Auction auc)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        //Reg_Auction auc = new Reg_Auction(auctionCode);
        auc.GetDataByCode();
        return j.Serialize(auc);
    }

    [WebMethod(Description ="get all questions for product by product code")]
    public string GetAllQuestions(Item prod)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        prod.GetAllQuestions();
        return j.Serialize(prod.Questions);
    }

    [WebMethod(Description = "add question to DB")]
    public string AddQuestion(FAQ quest)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        
        return j.Serialize(quest.AddQuestion().ToString());
    }

    [WebMethod(Description = "add answer of question to DB")]
    public string AddAnswer(FAQ quest)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(quest.AddAnswer().ToString());
    }

    [WebMethod (Description = "Get all active auctions in which I was outbidded ")]
    public string GetOutBiddedAuctions(string user_Id)
    {
        return "";
    }

    [WebMethod(Description = "Get all active auctions in which I am currently leading ")]
    public string Get_Current_LeadingAuctions(string user_Id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Reg_Auction.Leading(user_Id, "current"));
    }

    [WebMethod(Description = "Get all history auctions in which I won")]
    public string Get_History_LeadingAuctions(string user_Id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Reg_Auction.Leading(user_Id, "history"));
    }

    [WebMethod(Description = "add enter details of watched auction to watch log")]
    public string AddToWatch_Log(Reg_Auction auc, long enter)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        
        //translate time in ms to localized sql dateTime
        DateTime enterTime = (new DateTime(1970, 1, 1)).AddMilliseconds(double.Parse(enter.ToString())).ToLocalTime();

        return j.Serialize(auc.AddToWatch_Log(enterTime));
    }

    [WebMethod(Description = "update leave time of watched auction to watch log")]
    public string UpdateWatch_Log(Reg_Auction auc, long enter,long leave)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        
        //translate time in ms to localized sql dateTime
        DateTime enterTime = (new DateTime(1970, 1, 1)).AddMilliseconds(double.Parse(enter.ToString())).ToLocalTime();
        DateTime leaveTime = (new DateTime(1970, 1, 1)).AddMilliseconds(double.Parse(leave.ToString())).ToLocalTime();

        return j.Serialize(auc.UpdateWatch_Log(enterTime,leaveTime));
        
    }

    [WebMethod(Description = "Get all the auctions that I posted ")]
    public string GetAllMySells(string user_Id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Reg_Auction.GetAllMySells(user_Id));
    }


    //[WebMethod]
    //public void testsearch()
    //{
    //    JavaScriptSerializer j = new JavaScriptSerializer();
    //    Reg_Auction.AddNewSearch(302921481, 32.2262262, 36.3562, 10, 100, 500, 4);
    //}
}
