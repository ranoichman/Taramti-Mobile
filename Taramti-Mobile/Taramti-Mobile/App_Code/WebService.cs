using PushSharp;
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


    // מתודה להחזרת פרטי עמותה ספציפים ע"פ קוד עמותה
    //[WebMethod]
    //public Voluntary_association GetAssociationInfo(string code)
    //{
    //    // Voluntary_association V = new Voluntary_association();
    //    DataTable DT = new DataTable();
    //    List<string> L = Voluntary_association.GetAssociationByCode(code);

    //    if (DT.Rows.Count > 0)
    //    {
    //        return new Voluntary_association(DT.Rows[0][0].ToString(), DT.Rows[0][1].ToString(), DT.Rows[0][2].ToString());
    //    }
    //    else
    //    {
    //        return new Voluntary_association();
    //    }
    //}

    // מתודה להחזרת כלל העמותות
    //[WebMethod]
    //public List<Voluntary_association> GetAllAssociations()
    //{
    //    // Voluntary_association V = new Voluntary_association();
    //    DataTable DT = new DataTable();
    //    List<Voluntary_association> L = Voluntary_association.GetAllAssociations();
    //    if (DT.Rows.Count > 0)
    //    {
    //        //return  new Voluntary_association(DT.Rows[0][0].ToString(), DT.Rows[0][1].ToString(), DT.Rows[0][2].ToString());
    //        return L;
    //    }
    //    else
    //    {
    //        return L;
    //    }
    //}

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

    [WebMethod(Description = "")]
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
            //return temp_user.FirstName + " " + temp_user.LastName;
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

    [WebMethod]
    public string ChangePass(string id, string newPass)
    {
        UserT temp_user = new UserT();
        temp_user.UserId = id;
        temp_user.Password = newPass;
        temp_user.UpdatePassword();
        return "true";
    }

    /// <summary>
    /// נקודתית!!!!!!!!!!!!!!
    /// בפונקציה זו נדרוס את כתובת היוזר בערך ההרשאה של היוזר!!!
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



    [WebMethod]
    public string ValidateUser(string mail, string pass)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail, pass);
        return j.Serialize(temp.CheckLogin());
    }

    [WebMethod]
    public string GetUserID(string mail, string pass)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail, pass);
        return j.Serialize(temp.GetuserID());
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
    public string AddUser (string mail, string pass, string first, string last, string id)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT temp = new UserT(mail,pass);
        temp.UserId = id;
        if (!temp.CheckIfExictById())
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

    [WebMethod (Description = "הבאת פרטי המשתמש המחובר")]
    public string GetUserDetailsMobile(string userId)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        UserT U = new UserT();
        U.UserId = userId;
        return j.Serialize(U.GetUserDetails());
    }

    [WebMethod]
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
    public void SendPush(string head, string msg)
    {
        //Create our push services broker
        var push = new PushBroker();

        push.RegisterGcmService(new GcmPushChannelSettings("API KEY"));

        push.QueueNotification(new GcmNotification().ForDeviceRegistrationId("REG ID")
                              .WithJson("{\"message\": \" " + msg + " \", \"title\": \" " + head + " \"}"));

        //Stop and wait for the queues to drains
        push.StopAllServices();

    }





    //[WebMethod]
    //public void saveImage()
    //{
    //    SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["igroup77_prod"].ConnectionString);
    //    SqlCommand cmd = new SqlCommand(@"insert into pictures(img_description, img_data)
    //                                    values(@description, @img)", con);


    //    string file_name = "";

    //    HttpPostedFile file = HttpContext.Current.Request.Files["recFile"];
    //    System.Collections.Specialized.NameValueCollection param = HttpContext.Current.Request.Params;
    //    file_name = param["fileName"];      //file name

    //    Stream s = file.InputStream;
    //    BinaryReader br = new BinaryReader(s);
    //    byte[] b = br.ReadBytes((int)s.Length); //data


    //    cmd.Parameters.AddWithValue("@img", b);
    //    cmd.Parameters.AddWithValue("@description", file_name);


    //    try
    //    {
    //        con.Open();
    //        cmd.ExecuteNonQuery();
    //    }
    //    catch
    //    {

    //    }
    //    finally
    //    {
    //        con.Close();
    //    }
    //}

}
