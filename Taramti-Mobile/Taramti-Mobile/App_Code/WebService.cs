﻿using PushSharp;
using PushSharp.Android;
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

    [WebMethod(Description = "בדיקה האם ת.ז ומייל מופיעים בנתוני המשתמש ")]
    public string CheckInDatabase(string id, string mail)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp_user = new UserT();
        temp_user.Mail = mail;
        temp_user.UserId = id;
        if (temp_user.CheckForResetPass())
        {
            temp_user.GetUserName();
            return j.Serialize(temp_user);
        }
        return "false";
    }

    [WebMethod(Description = "הוספת משתמש כמורשה גישה לעמותה")]
    public string AddMursheAssoc(string id, int assocCode)
    {
        if (!CheckMursheAssoc(id, assocCode))
        {
            if (Voluntary_association.AddMursheAssoc(id, assocCode))
            {
                return "true";
            }
            else
            {
                return "קיימת בעיה עם הוספת המורשה יש לפנות למנהלי המערכת, תודה";
            }
        }
        return "המשתמש הוגדר כבר בעבר כמורשה לעמותה זו";
    }

    /// <summary>
    /// מתודה שבודקת אם למשתמש יש הרשאה לעמותה לפי קוד עמותה ות.ז משתמש
    /// </summary>
    /// <returns>מחזירה נכון או לא</returns>
    [WebMethod]
    public bool CheckMursheAssoc(string id, int assocCode)
    {
        List<string> MurshimId = new List<string>();
        MurshimId = Voluntary_association.GetAssociationMurshimByCodeAmuta(assocCode);

        foreach (string MursheId in MurshimId)
        {
            while (MursheId == id)
            {
                return true;
            }
        }

        return false;
    }

    [WebMethod (Description = "עדכון סיסמאת המשתמש")]
    public string ChangePass(string id, string newPass)
    {
        UserT temp_user = new UserT();
        temp_user.UserId = id;
        temp_user.Password = newPass;
        if (temp_user.CheckIfExistById())
        {
            temp_user.UpdatePassword();
            return "true";
        }
        else
        {
            return "false";
        }
        
        
    }

    /// <summary>
    /// נקודתית!!!!!!!!!!!!!!
    /// בפונקציה זו נדרוס את כתובת היוזר בערך ההרשאה של היוזר!!!
    /// הבאת פרטי המשתמש מקוקיז
    /// </summary>
    /// <returns></returns>
    //(Description ="WebService to return the logged in user ID and info ")
    [WebMethod(EnableSession = true)]
    public string GetUserDetails()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp_user = new UserT();

        HttpContext context = HttpContext.Current;

        if (context.Session["UserID"] == null)
        {
            return j.Serialize("NOCOOKIE");
        }
        temp_user.UserId = (string)(context.Session["UserID"]);
        int auth = temp_user.CheckAuthDesktop();
        if (auth == -1)
        {
            return j.Serialize("NOCOOKIE");
        }
        else
        {
            temp_user.Address = auth.ToString();
        }

        temp_user.GetUserDetails();
        return j.Serialize(temp_user);
    }

    [WebMethod(Description = "Clearing User cookies")]
    public void ClearCookie()
    {
        HttpRequest Request = System.Web.HttpContext.Current.Request;

        if (Request.Cookies.Get("userCookie") != null)
        {
            HttpCookie cookie = Request.Cookies["userCookie"];
            cookie.Expires = DateTime.Now.AddYears(-12);
            HttpContext.Current.Response.SetCookie(cookie);
        }

    }

    [WebMethod (Description = "ביצוע ולידציה - בדיקה האם היוזר קיים ע'פ מייל וסיסמא")]
    public string ValidateUser(string mail, string pass)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail, pass);
        return j.Serialize(temp.CheckLogin());
    }

    [WebMethod (Description = "הפונקציה מחזירה את תז של המשתמש. בנוסף - תזין את פרטי המכשיר לצורך פוש ")]
    public string GetUserID(string mail, string pass, string device, string platform)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail, pass);
        int UserId = temp.GetuserID();
        SavePushInfo(UserId.ToString(),device,platform);
        return j.Serialize(UserId);
    }

 

    [WebMethod (Description = "הכנסת משתמש חדש")]
    public string AddUser (string mail, string pass, string first, string last, string id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail,pass);
        temp.UserId = id;
        if (!temp.CheckIfExistById())
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

// הפונקציה מעדכנת את נתוני המשתמש בבסיס הנתונים 
    [WebMethod]
    public string AddUserAllInfo(string id, string phone, int city, string street, string num)
    {
      JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT();
        temp.UserId = id;
        if (temp.CheckIfExistById())
        {
            City C = new City();
            C.CityCode = city;
            temp.City = C;
            temp.Address = street + " " +num;
            temp.Number = phone;
            temp.UpdateUser();
            return j.Serialize("True");
        }
        else
        {
            return j.Serialize("False");
        }
    }

    [WebMethod (Description = "הבאת פרטי המשתמש המחובר")]
    public string GetUserDetailsMobile(string userId)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT U = new UserT();
        U.UserId = userId;
        return j.Serialize(U.GetUserDetails());
    }

    [WebMethod (Description = "הבאת כל הערים מבסיס הנתונים")]
    public string GetAllCities()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        City C = new City();
        return j.Serialize(C.GetAllCities());
    }

    [WebMethod (Description = "עדכון פרטי משתמש")]
    public string UpdateUser(string userId, string first, string last, string address, string phone)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT U = new UserT();
        U.UserId = userId;
        U.FirstName = first;
        U.LastName = last;
        U.Address = address;
        U.Number = phone;
        return j.Serialize(U.UpdateExistingUser());
    }

    [WebMethod (Description = "הזנת נתוני העדפות מהגדרות האפליקציה לשרת")]
    public void SaveSettings(string user,bool push, bool sound, bool vibe)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Settings S = new Settings(user, push, vibe, sound);
        S.Insert();
    }

    [WebMethod (Description = "שמירת נתונים בטבלת פוש בבסיס הנתונים")]
    public string SavePushInfo(string userId, string deviceString, string platform)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Push P = new Push(userId, deviceString, platform);
        return j.Serialize( P.AddPushDetails());
    }

    [WebMethod (Description = "פונקציה לשליחת הודעת פוש")]
    public void SendPush(string user, string head, string msg)
    {
        //Create our push services broker
        var push = new PushBroker();

        Push P = new Push(user);
        P.GetPushInfo();

        push.RegisterGcmService(new GcmPushChannelSettings("AIzaSyAPLuLHXvJc4z7XgMfKoH9KMDDgDQS7cGQ"));

        push.QueueNotification(new GcmNotification().ForDeviceRegistrationId(P.DeviceString)
                              .WithJson("{\"message\": \" " + msg + " \", \"title\": \" " + head + " \"}"));

        //Stop and wait for the queues to drains
        push.StopAllServices();

    }

    [WebMethod (Description ="The Server Version")]
    public void ServerVersion()
    {
        ServerAuctionFinish();
        ServerPush();
    }

    [WebMethod(Description = "The Server Version - Sends Push To Nearly Finished Auctions And Winners In Auctions")]
    public void ServerPush()
    {
        Server_Side Serv = new Server_Side();
        Serv.SendPushes();
    }

    [WebMethod(Description = "The Server Version - Closes Auctions And Determins Winners")]
    public void ServerAuctionFinish()
    {
        Server_Side Serv = new Server_Side();
        Serv.CloseAuctions();
    }

    [WebMethod(Description = "הבאת העדפות המשתמש מבסיס הנתונים")]
    public string GetUserPreferences(string user_id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT S = new UserT(user_id);
        return j.Serialize(S.GetUserPreferences());
    }

    [WebMethod(Description = "עדכון עמותה מועדפת למשתמש")]
    public string UpdateFavAssoc(string user_id, string assoc, bool action)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT S = new UserT(user_id);
        return j.Serialize(S.UpdateFavAssoc(assoc,action));
    }

    [WebMethod(Description = "האם עמותה מועדפת אצל המשתמש?")]
    public string IsFavAssoc(string user_id, string assoc)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT S = new UserT(user_id);
        return j.Serialize(S.IsFavAssoc(assoc));
    }

}
