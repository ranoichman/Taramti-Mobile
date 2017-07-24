using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;

/// <summary>
/// Summary description for Class1
/// </summary>
public class UserT
{
    string userId, firstName, lastName, address, mail, password;
    string number;
    bool active;
    Rank rank;
    City city;
    Item[] items;
    Bid[] bids;

    //props
    #region
    public string Address
    {
        get { return address; }
        set { address = value; }
    }

    public string LastName
    {
        get { return lastName; }
        set { lastName = value; }
    }

    public string FirstName
    {
        get { return firstName; }
        set { firstName = value; }
    }

    public string UserId
    {
        get { return userId; }
        set { userId = value; }
    }

    public Rank Rank
    {
        get
        {
            return rank;
        }

        set
        {
            rank = value;
        }
    }

    public City City
    {
        get
        {
            return city;
        }

        set
        {
            city = value;
        }
    }

    public Item[] Items
    {
        get
        {
            return items;
        }

        set
        {
            items = value;
        }
    }

    public Bid[] Bids
    {
        get
        {
            return bids;
        }

        set
        {
            bids = value;
        }
    }

    public string Mail
    {
        get
        {
            return mail;
        }

        set
        {
            mail = value;
        }
    }

    public string Password
    {
        get
        {
            return password;
        }

        set
        {
            password = value;
        }
    }

    public bool Active
    {
        get
        {
            return active;
        }

        set
        {
            active = value;
        }
    }

    public string Number
    {
        get
        {
            return number;
        }

        set
        {
            number = value;
        }
    }
    #endregion

    //ctor
    public UserT()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public UserT(string userID)
    {
        UserId = userID;
    }

    public UserT(string userId, string firstName, string lastName, bool active, Rank tempRank)
    {
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
        Active = active;
        Rank = tempRank;
    }

    public UserT(string userId, string firstName, string lastName, bool active)
    {
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
        Active = active;
    }

    public UserT(string mail, string pass)
    {
        Mail = mail;
        Password = pass;
    }

    public UserT(string id, bool active)
    {
        UserId = id;
        Active = active;
    }



    /*
     ////////////////////////////
     ////////////////////////////
     מתודות
     ////////////////////////////
     ////////////////////////////
    */


    //methods
    #region

    /// <summary>
    /// מתודה לבדיקה האם המשתמש קיים
    /// </summary>
    /// <returns>תחזיר אמת אם המשתמש קיים, שקר אחרת</returns>
    public bool CheckLogin()
    {
        string sqlSelect = @"SELECT [user_id]
                            FROM [dbo].[users]
                            where (email = @email) and ([password] = @password)";
        DbService db = new DbService();
        SqlParameter parEmail = new SqlParameter("@email", Mail);
        SqlParameter parPass = new SqlParameter("@password", Password);
        try
        {
            UserId = db.GetScalarByQuery(sqlSelect, CommandType.Text, parEmail, parPass).ToString();
            if (UserId != "0")
            {
                return true;
            }
            else
                return false;
        }
        catch (Exception ex)
        {
            return false;
        }

    }

    // החזרת תז של המשתמש
    public int GetuserID()
    {
        string sqlSelect = @"SELECT [user_id]
                            FROM [dbo].[users]
                            where (email = @email) and ([password] = @password)";
        DbService db = new DbService();
        SqlParameter parEmail = new SqlParameter("@email", Mail);
        SqlParameter parPass = new SqlParameter("@password", Password);
        try
        {
            UserId = db.GetScalarByQuery(sqlSelect, CommandType.Text, parEmail, parPass).ToString();
            if (UserId != "0")
            {
                return int.Parse( UserId);
            }
            else
                return -1;
        }
        catch (Exception ex)
        {
            return -1;
        }

    }


    /// <summary>
    /// מתודה לבדיקת ההרשאות של המשתמש
    /// </summary>
    /// <returns>תחזיר 1 במידה והמשתמש מנהל מערכת, 2 במידה ומורשה גישה לעמותות ומינוס 1 (1-) אם המשתמש משתמש רגיל</returns>
    public int CheckAuthDesktop()
    {
        string sqlSelect = @"SELECT count([user_id])
                            FROM [dbo].[admin]
                            where (user_id = @user_id)";
        DbService db = new DbService();
        SqlParameter parUser = new SqlParameter("@user_id", UserId);
        int auth = -1;
        auth = db.GetScalarByQuery(sqlSelect, CommandType.Text, parUser); //בדיקה האם אדמין
        if (auth != 1)
        {
            sqlSelect = @"SELECT count([association_code])
                        FROM [dbo].[association_access]
                        where user_id=@user_id";
            auth = db.GetScalarByQuery(sqlSelect, CommandType.Text, parUser);
            if (auth >= 1)
            {
                auth = 2;
            }
            else
            {
                auth = -1;
            }
        }
        return auth;
    }

    /// <summary>
    /// מתודה לבדיקה האם ת.ז ומייל המשתמש מופיעים
    /// </summary>
    /// <returns>מחזירה אמת במידה וכן ושקר אחרת</returns>
    public bool CheckForResetPass()
    {
        string sqlSelect = @"SELECT count([user_id])
                            FROM [dbo].[users]
                            where (email = @email) and ([user_id] = @user_id)";
        DbService db = new DbService();
        SqlParameter parEmail = new SqlParameter("@email", Mail);
        SqlParameter parUser = new SqlParameter("@user_id", UserId);
        int res = 0;
        try
        {
            res = db.GetScalarByQuery(sqlSelect, CommandType.Text, parEmail, parUser);
            if (res != 0)
            {
                return true;
            }
            else
                return false;
        }
        catch (Exception ex)
        {
            return false;
        }

    }
    // בדיקה האם משתמש קיים על פי תז
    public bool CheckIfExistById()
    {
        string sqlSelect = @"SELECT count([user_id])
                            FROM [dbo].[users]
                            where ([user_id] = @user_id)";
        DbService db = new DbService();
        SqlParameter parUser = new SqlParameter("@user_id", UserId);
        int res = 0;
        try
        {
            res = db.GetScalarByQuery(sqlSelect, CommandType.Text, parUser);
            if (res != 0)
            {
                return true;
            }
            else
                return false;
        }
        catch (Exception ex)
        {
            return false;
        }

    }

    /// <summary>
    /// מתודה לשינוי סיסמה במסד הנתונים
    /// </summary>
    public void UpdatePassword()
    {
        string sqlUpdate = "UPDATE [dbo].[users] SET [password]=@password WHERE user_id = @userID";
        SqlParameter parUser = new SqlParameter("@userID", UserId);
        SqlParameter parPass = new SqlParameter("@password", Password);
        DbService db = new DbService();
        db.ExecuteQuery(sqlUpdate, CommandType.Text, parPass, parUser);
    }

    // פונקציה לשליחת מיילים
    /// <summary>
    /// מתודה לשליחת מייל
    /// </summary>
    public void SendMail()
    {
        // עדכון סיסמא
        Password = "000000";
        UpdatePassword();

        string Sbjct = "איפוס סיסמא למשתמש " + FirstName + " " + LastName + ".";
        string MyHdr = "";
        string StrHtml = "";

        MyHdr += "<div dir='rtl'>" + "שלום" + ",";
        MyHdr += "<BR>";
        MyHdr += "<BR>";
        MyHdr += "בקשתך לאיפוס סיסמא התקבלה וסיסמתך שונתה בהצלחה.  ";
        MyHdr += "<BR>";
        MyHdr += " סיסמתך החדשה הינה: " + "000000";
        MyHdr += "</DIV>";
        MyHdr += "<DIV align=right>";

        MyHdr += "<BR align=right>";

        MailMessage message = new MailMessage();
        // To 
        message.To.Add(new MailAddress(Mail));
        // From Query
        message.From = new MailAddress("recoverpass@taramti.co.il");

        message.Subject = Sbjct;
        message.IsBodyHtml = true;

        message.Body = MyHdr + "\n\r\n\r" + StrHtml;
        AlternateView htmlView = AlternateView.CreateAlternateViewFromString(message.Body, null, "text/html");
        message.AlternateViews.Add(htmlView);


        SmtpClient client = new SmtpClient();
        client.Host = "smtp.gmail.com";
        client.Port = 587;
        client.EnableSsl = true;
        client.DeliveryMethod = SmtpDeliveryMethod.Network;
        client.UseDefaultCredentials = false;
        //client.Credentials = new NetworkCredential("heregteam@gmail.com", "teamhereg!1");
        //(1)
        client.UseDefaultCredentials = true;
        //(2) 
        client.Credentials = new System.Net.NetworkCredential("heregteam@gmail.com", "teamhereg");
        client.Send(message);
    }

    /// <summary>
    /// מתודה להבאת פרטי יוזרים לטבלת ניהול משתמשים בדף אדמין
    /// </summary>
    /// <returns>מחזירה רשימה המכילה משתמשים</returns>
    internal static List<UserT> GetAllUsers()
    {
        List<UserT> li_rtn = new List<UserT>();
        string sqlSelect = @"select V_full_users_rank_combo.user_id, users.first_name,users.last_name,users.active, V_full_users_rank_combo.Rank, V_association_access.association_access
                            from V_full_users_rank_combo, V_association_access, users
                            where V_full_users_rank_combo.user_id = V_association_access.user_id and V_full_users_rank_combo.user_id = users.user_id";
        DbService db = new DbService();
        DataTable usersDT = db.GetDataSetByQuery(sqlSelect).Tables[0];
        List<Rank> ranksList = Rank.GetAllRanks();
        foreach (DataRow row in usersDT.Rows)
        {
            string id = row["user_id"].Equals(DBNull.Value) ? "" : row["user_id"].ToString();
            string fName = row["first_name"].Equals(DBNull.Value) ? "" : row["first_name"].ToString();
            string lName = row["last_name"].Equals(DBNull.Value) ? "" : row["last_name"].ToString();
            bool active = row["active"].Equals(DBNull.Value) ? false : bool.Parse(row["active"].ToString());
            int rankSum = row["rank"].Equals(DBNull.Value) ? 0 : int.Parse(row["rank"].ToString());
            Rank tempRank = new Rank();
            foreach (Rank item in ranksList)
            {

                if ((rankSum >= item.Minimum) && (rankSum <= item.Max))
                {
                    tempRank = item;
                    break;
                }
            }
            UserT temp_user = new UserT(id, fName, lName, active, tempRank);
            temp_user.Address = row["association_access"].Equals(DBNull.Value) ? "0" : row["association_access"].ToString();//שימוש חד פעמי בשדה כתובת להעברת מס' לדף הטמל
            li_rtn.Add(temp_user);
        }

        return li_rtn;
    }

    /// <summary>
    /// מתודה המביאה שם משתמש המלא לפי המייל שלו
    /// </summary>
    /// <returns>מחזירה שם מלא של משתמש</returns>
    public void GetUserName()
    {
        string sqlSelect = @"Select [first_name], [last_name] 
                            from [dbo].[users]
                            Where [email] = @email";
        DbService db = new DbService();
        SqlParameter parEmail = new SqlParameter("@email", Mail);
        DataTable dt = new DataTable();
        try
        {
            dt = db.GetDataSetByQuery(sqlSelect, CommandType.Text, parEmail).Tables[0];
            FirstName = dt.Rows[0][0].ToString();
            LastName = dt.Rows[0][1].ToString();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    /// <summary>
    /// שינוי סטטוס המשתמש בין פעיל ולא פעיל
    /// </summary>
    public void ChangeActive()
    {
        string sqlDelete = "UPDATE [dbo].[users] SET active = @active WHERE user_id = @userID";
        SqlParameter parUser = new SqlParameter("@userID", UserId);
        SqlParameter parActive = new SqlParameter("@active", Active ? 1 : 0);
        DbService db = new DbService();
        db.ExecuteQuery(sqlDelete, CommandType.Text, parUser, parActive);
    }

    /// <summary>
    /// מתודה להבאת רשימת העמותות אליהם משוייך המשתמש
    /// </summary>
    /// <returns>מחזירה רשימה של עמותות</returns>
    public List<Voluntary_association> GetUserAssociations()
    {
        List<Voluntary_association> li_rtn = new List<Voluntary_association>();
        string StrSql = "SELECT dbo.association_access.association_code, dbo.association.association_name, dbo.association.association_desc, dbo.association.website, dbo.association.year, dbo.association.image " +
                         "FROM dbo.association_access " +
                         "INNER JOIN dbo.association ON dbo.association_access.association_code = dbo.association.association_code " +
                         "LEFT OUTER JOIN dbo.users ON dbo.association_access.user_id = dbo.users.user_id " +
                         "WHERE(dbo.users.user_id = @user_id) ";
        SqlParameter parUserID = new SqlParameter("@user_id", UserId);
        DbService db = new DbService();
        DataTable DT = db.GetDataSetByQuery(StrSql,CommandType.Text,parUserID).Tables[0];
        foreach (DataRow row in DT.Rows)
        {
            // מילוי פרטים
            Voluntary_association assoc = new Voluntary_association();
            assoc.Association_Code = row[0].ToString();
            assoc.Association_Name = row[1].ToString();
            assoc.Association_Desc = row[2].ToString();
            assoc.Association_WebSite = row[3].ToString();
            assoc.Association_Year = row[4].ToString();
            assoc.Association_Image = row[5].ToString();
            li_rtn.Add(assoc);
        }
        return li_rtn;
    }

    /// <summary>
    /// מתודה להבאת כמות המשתמשים הפעילים
    /// </summary>
    /// <returns>מחזירה את כמות המשתמשים הפעילים</returns>
    public static int CountActiveUsers()
    {
        string sql = @"select COUNT(user_id)
                        from dbo.users
                        where active = @active";
        SqlParameter parActive = new SqlParameter("@active", true);
        DbService db = new DbService();
        int res = db.GetScalarByQuery(sql, CommandType.Text, parActive);
        return res;
    }

    // מתודה המחזירה את רשימת העמותות המועדפות ליוזר
    public List<Voluntary_association> GetFavAssocById()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Voluntary_association> FavAssoc = new List<Voluntary_association>();

        string StrSql = @"SELECT dbo.association.association_code as AssocCode, dbo.association.association_name as AssocName
                    FROM  dbo.user_pref_association INNER JOIN
                           dbo.association ON dbo.user_pref_association.association_code = dbo.association.association_code
                    WHERE   (dbo.user_pref_association.user_id = N'" + UserId + "')";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables[0].Rows.Count > 0)
        {
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                Voluntary_association V = new Voluntary_association();
                V.Association_Code = row["AssocCode"].ToString();
                V.Association_Name = row["AssocName"].ToString();
                FavAssoc.Add(V);
            }
        }
        return FavAssoc;
    }

    public void GetUsersAuctions() { }

    public void ShowAvgRank() { }

    public void Subscribe() { }

    // עדכון פרטי המשתמש במערכת
    public bool UpdateUser()
    {
        string StrSql = @"Update [dbo].[users] 
                          set [city_code] = @city,[address] = @street,[phone] = @phone
                          where [user_id] =@user";

        DbService db = new DbService();
        SqlParameter parId = new SqlParameter("@user", UserId);
        SqlParameter parStreet = new SqlParameter("@street", Address);
        SqlParameter parPhone = new SqlParameter("@phone", Number);
        SqlParameter parCity = new SqlParameter("@city", City.CityCode);
        if (db.ExecuteQuery(StrSql, CommandType.Text, parId, parStreet, parPhone, parCity) == 0)
        {
            return false;
        }
        return true;
    }

    // מעדכן פרטים שהפונקציה הרגילה לא מעדכנת
    public bool UpdateExistingUser()
    {
        string sqlInsert = @"update [dbo].[users] set [first_name] = @fName,[last_name]= @lname,[address] = @address,[phone] = @phone 
                            Where [user_id] ='" + UserId + "' ";

        DbService db = new DbService();
        SqlParameter parFName = new SqlParameter("@fName", FirstName);
        SqlParameter parLName = new SqlParameter("@lName", LastName);
        SqlParameter parCity = new SqlParameter("@address", address);
        SqlParameter parNum = new SqlParameter("@phone", Number);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parFName, parLName, parCity, parNum) == 0)
        {
            return false;
        }
        return true;
    }
    // החזרת אובייקט משתמש עם כל פרטי המשתמש
    public UserT GetUserDetails()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        
        string StrSql = "";
        StrSql = "select * from users where user_id ='" + UserId + "' ";
        DS = db.GetDataSetByQuery(StrSql);
        if (DS.Tables[0].Rows.Count > 0)
        {
            FirstName = DS.Tables[0].Rows[0][1].ToString();
            LastName = DS.Tables[0].Rows[0][2].ToString();
            Address = DS.Tables[0].Rows[0][4].ToString();
            Number = DS.Tables[0].Rows[0][5].ToString();
            Mail = DS.Tables[0].Rows[0][6].ToString();
            Active = bool.Parse(DS.Tables[0].Rows[0][8].ToString());
            Rank = GetUserRank(UserId);
        }
        return this;
    }
    // החזרת דירוג המשתמש על פי תז
    internal static Rank GetUserRank(string userId)
    {
        DbService db = new DbService();
        string sqlSelect = @"SELECT        user_id, Rank
                                FROM            dbo.V_full_users_rank_combo
                                WHERE        (user_id = N'" + userId + "')";
        DataTable rankDT = db.GetDataSetByQuery(sqlSelect).Tables[0];
        List<Rank> ranksList = Rank.GetAllRanks();
        Rank R = new Rank();
        if (rankDT.Rows.Count > 0)
        {
            int rankSum = rankDT.Rows[0][1].Equals(DBNull.Value) ? 0 : int.Parse(rankDT.Rows[0][1].ToString());

            foreach (Rank item in ranksList)
            {
                if ((rankSum >= item.Minimum) && (rankSum <= item.Max))
                {
                    R = item;
                    break;
                }
            }
        }
        return R;
    }

    public void GetUserBids() { }

    public void GetUserProducts() { }

    public void SendPushToUsers() { }
    // הכנסת משתמש חדש למערכת
    public bool InsertUser()
    {
        string sqlInsert = @"insert into [dbo].[users]
                           ([user_id],[first_name],[last_name],[email],[password])
                            VALUES 
                            (@id, @fName, @lname, @mail, @pass)";

        DbService db = new DbService();
        SqlParameter parId = new SqlParameter("@id", UserId);
        SqlParameter parFName = new SqlParameter("@fName", FirstName);
        SqlParameter parLName = new SqlParameter("@lName", LastName);
        SqlParameter parMail = new SqlParameter("@mail", Mail);
        SqlParameter parPassword = new SqlParameter("@pass", Password);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parId, parFName, parLName, parMail, parPassword) == 0)
        {
            return false;
        }
        return true;
    }
    // בדיקה האם המשתמש הוא אדמין במערכת
    public bool CheckUserInAdmin()
    {
        string sqlSelect = @"SELECT count([user_id])
                            FROM [dbo].[Admin]
                            where ([user_id] = @user_id)";
        DbService db = new DbService();
        SqlParameter parUser = new SqlParameter("@user_id", UserId);
        int res = 0;
        try
        {
            res = db.GetScalarByQuery(sqlSelect, CommandType.Text, parUser);
            if (res != 0)
            {
                return true;
            }
            else
                return false;
        }
        catch (Exception ex)
        {
            throw ex;
        }

    }
    // הוספת מורשה מטעם מנהלי העמותות
    public bool AddMursheManager()
    {
        string sqlInsert = @"insert into [dbo].[admin]
                           ([user_id])
                            VALUES 
                            (@id)";
        DbService db = new DbService();
        SqlParameter parId = new SqlParameter("@id", UserId);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parId) == 0)
        {
            return false;
        }
        return true;
    }
    // החזרת העדפות המשתמש (פוש,צליל ועוד) 
    public Settings GetUserPreferences()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        Settings S = new Settings();

         string StrSql = @"SELECT * FROM [dbo].[user_settings]
                             WHERE ([user_id] = (@id))";
        
        SqlParameter parId = new SqlParameter("@id", UserId);
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parId);

        if (DS.Tables[0].Rows.Count > 0)
        {
            return S = new Settings(DS.Tables[0].Rows[0]["user_id"].ToString(), bool.Parse(DS.Tables[0].Rows[0]["push"].ToString()), bool.Parse(DS.Tables[0].Rows[0]["vibe"].ToString()), bool.Parse(DS.Tables[0].Rows[0]["sound"].ToString()));
        }
        return S;
    }

    // עדכון עמותות מועדפות למשתמש. אם האקטיון הוא 0 אז נמחק ואם 1 אז נזין
    public bool UpdateFavAssoc(string assoc, bool action)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        string StrSql = "";

        if (action)
        {
            StrSql = @"INSERT INTO [dbo].[user_pref_association]
                            values(@user,@assoc)";
        }
        else
        {
            StrSql = @"DELETE FROM [dbo].[user_pref_association]
                       WHERE [user_id] = @user and [association_code] = @assoc ";
        }

        SqlParameter parId = new SqlParameter("@user", UserId);
        SqlParameter parAssoc = new SqlParameter("@assoc", assoc);
        if (db.ExecuteQuery(StrSql, CommandType.Text, parId, parAssoc) == 0)
        {
            return false;
        }
        return true;
    }
    // בדיקה האם העמותה היא עמותה מועדפת למשתמש
    public bool IsFavAssoc(string assoc)
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();

        string StrSql = @"SELECT * FROM [dbo].[user_pref_association]
                            WHERE [user_id] = @user AND [association_code] =@assoc";
        SqlParameter parId = new SqlParameter("@user", UserId);
        SqlParameter parAssoc = new SqlParameter("@assoc", assoc);
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parId, parAssoc);

        if (DS.Tables[0].Rows.Count > 0)
        {
            return true;
        }
        return false;
    }
    #endregion

}
