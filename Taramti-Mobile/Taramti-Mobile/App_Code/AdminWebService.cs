using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for AdminWebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class AdminWebService : System.Web.Services.WebService
{

    public AdminWebService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent();
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod (Description ="הבאת כל העמותות")]
    public string GetAllAssociations()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();

        return j.Serialize(Voluntary_association.GetAllAssociations());
    }

    //// לשים מספר דינמי בדוק הנשלח 
    //[WebMethod]
    //public string GetAssociationByCode(string code)
    //{
    //    JavaScriptSerializer j = new JavaScriptSerializer();
    //    return j.Serialize(Voluntary_association.GetAssociationByCode(code));
    //}

    [WebMethod (Description ="הבאת כל המשתמשים")]
    public string GetAllUsers()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(UserT.GetAllUsers());
    }

    [WebMethod (Description ="שינוי סטטוס למשתמש")]
    public void ChangeActive(string id, bool active)
    {
        UserT temp_user = new UserT(id, active);
        temp_user.ChangeActive();
    }

    [WebMethod (Description ="בדיקה במסד הנתונים והוספת משתמש כאדמין")]
    public string CheckInDatabaseAndAdd(string firstName, string lastName, string id, string mail)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp_user = new UserT();
        temp_user.FirstName = firstName;
        temp_user.LastName = lastName;
        temp_user.Mail = mail;
        temp_user.UserId = id;
        if (!temp_user.CheckIfExictById())
        {
            temp_user.InsertUser();
            temp_user.AddMursheManager();
            //insert to users       
        }
        else
        {
            //בודקת אם קיים באדמין או לא

            if (temp_user.CheckUserInAdmin())
            {
                return "המשתמש כבר הוגדר בעבר כמנהל מערכת";
            }
            //מוסיפה לטבלת אדמין
            else
            {
                temp_user.AddMursheManager();
            }
        }
        return "המשתמש הוגדר כמנהל מערכת בהצלחה";
    }

    [WebMethod(Description = "ספירת המשתמשים הפעילים")]
    public string CountActiveUsers()
    {
        return UserT.CountActiveUsers().ToString();
    }

    [WebMethod(Description = "הבאת מכרזים פעילים")]
    public string GetActiveAuctions()
    {
        DateTime date = DateTime.Now;
        JavaScriptSerializer j = new JavaScriptSerializer();
        return j.Serialize(Auction.GetAllAuctionsByDates(date));
    }

    [WebMethod(Description ="הבאת סכום התרומה בחודש האחרון")]
    public int GetDonationsLastMonth()
    {
        DateTime date = DateTime.Now;
        return Auction.GetDonationSumByDates(date.AddMonths(-1), date);
    }

    [WebMethod(Description ="הבאת סכום התרומות הכולל לעמותה לפי קוד")]
    public int GetDonationSum(string code)
    {
        Voluntary_association v = new Voluntary_association(code);
        return v.GetDonationSum();
    }
     
    [WebMethod(Description = "הבאת שם עמותה, סכום מכרזים וסכום התרומה לכל עמותה בחודש האחרון")]
    public string Chart_NameTotalSumDonationSum_OfLastMonth()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        DateTime date = DateTime.Now;
        return j.Serialize(Auction.GetAssocNameTotalSumDonationSumByDates(date.AddMonths(-6), date));
    }
}
