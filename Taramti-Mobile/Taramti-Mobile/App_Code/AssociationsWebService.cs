using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// Summary description for AssociationsWebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class AssociationsWebService : System.Web.Services.WebService
{

    public AssociationsWebService()
    {
        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld()
    {
        return "Hello World";
    }

    [WebMethod(Description = "Gets associations information for the Associations page")]
    public string GetAmutaDetails(string code)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Voluntary_association Assoc = new Voluntary_association();
        Assoc.Association_Code = code;
        Assoc.GetAssociationByCodeAmuta();
        return j.Serialize(Assoc);
    }

    [WebMethod (Description ="הבאת פרטי כל העמותות")]
    public string GetAllAmotaDetails()
    {
        JavaScriptSerializer j = new JavaScriptSerializer();

        return j.Serialize(Voluntary_association.GetAllAssociations());
    }

    [WebMethod(Description = "Gets the logged in user's associated associations ",EnableSession =true)]
    public string GetUserAmutot()
    {
        UserT temp_user = new UserT();
        JavaScriptSerializer j = new JavaScriptSerializer();
        HttpContext context = HttpContext.Current;

        if (context.Session["UserID"] == null)
        {
            return j.Serialize("NOCOOKIE");
        }
        temp_user.UserId = (string)(context.Session["UserID"]);

        List<Voluntary_association> List = new List<Voluntary_association>();
        List = temp_user.GetUserAssociations();
        return j.Serialize(List);
    }

    [WebMethod (Description = "Updates the Association information in the DataBase")]
    public void UpdateAssociation(string code, string name, string desc, string account, string web, string year)
    {
        Voluntary_association temp = new Voluntary_association(code,name,desc,account,web,year);
        temp.UpdateTbl();
    }

    [WebMethod (Description = "Inserts a new Association to the DB")]
    public string AddNewAssoc(string code, string name, string desc, string account, string web, string year)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Voluntary_association temp = new Voluntary_association(code, name, desc, account, web, year);
        temp.AddAssoc();
        return j.Serialize("True");
    }

    [WebMethod(Description = "Inserts a new Temp Association to the DB")]
    public string AddNewTempAssoc(string code, string name, string desc, string account, string web, string year)
    {
        JavaScriptSerializer j = new JavaScriptSerializer();
        Voluntary_association temp = new Voluntary_association(code, name, desc, account, web, year);
        temp.AddTempAssoc();
        return j.Serialize("True");
    }
    
}

















































































































