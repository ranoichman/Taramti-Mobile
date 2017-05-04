using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for WebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
 [System.Web.Script.Services.ScriptService]
public class WebService : System.Web.Services.WebService
{

    public WebService()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod]
    public string ValidateUser(string mail, string pass)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail, pass);
        return j.Serialize(temp.CheckLogin());
    }

    //[WebMethod(Description = "בדיקה אם פרטי המשתמש נכונים ואיפוס סיסמה")]
    //public string CheckValidUser(string id, string mail)
    //{
    //    UserT temp_user = new UserT();
    //    temp_user.Mail = mail;
    //    temp_user.UserId = id;
    //    if (temp_user.CheckForResetPass())
    //    {
    //        temp_user.SendMail();//שליחת מייל
    //        return "true";
    //    }
    //    return "false";
    //}

    [WebMethod]
    public string ChangePass(string id, string newPass)
    {
        UserT temp_user = new UserT();
        temp_user.UserId = id;
        temp_user.Password = newPass;
        temp_user.UpdatePassword();
        return "True";
    }

    [WebMethod]
    public string AddUser (string mail, string pass, string first, string last, string id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail,pass);
        temp.UserId = id;
        if (temp.CheckIfExictById())
        {
            temp.FirstName = first;
            temp.LastName = last;
            temp.Mail = mail;

            temp.InsertUser();
            return j.Serialize("True");
        }
        else
        {
            return j.Serialize("False");
        }
    }

    // לטפל!!! צריך לסגור הפינה אחרי שסוגרים רשימת ערים 
    [WebMethod]
    public string AddUserAllInfo(string id, string phone, int city, string street, string num)
    {
      JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT();
        temp.UserId = id;
        if (temp.CheckIfExictById())
        {
            City C = new City();
            C.CityCode = city;
            temp.City = C;
            //temp.LastName = last;
            //temp.Mail = mail;

            temp.UpdateUser();
            return j.Serialize("True");
        }
        else
        {
            return j.Serialize("False");
        }
    }

    [WebMethod]
    public string GetAllCities()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        City C = new City();
        return j.Serialize(C.GetAllCities());
    }

    [WebMethod(Description = "בדיקה אם פרטי המשתמש נכונים ואיפוס סיסמה")]
    public string CheckValidUser(string id, string mail)
    {
        UserT temp_user = new UserT();
        temp_user.Mail = mail;
        temp_user.UserId = id;
        if (temp_user.CheckForResetPass())
        {
            temp_user.SendMail();//שליחת מייל
            return "true";
        }
        return "false";
    }

}
