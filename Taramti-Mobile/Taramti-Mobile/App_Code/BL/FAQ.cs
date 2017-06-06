using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for FAQ
/// </summary>
public class FAQ
{
    //fields
    int prodCode;
    string question, answer;
    UserT questioner;

    //props
    #region
    public int ProdCode
    {
        get
        {
            return prodCode;
        }

        set
        {
            prodCode = value;
        }
    }

    public string Question
    {
        get
        {
            return question;
        }

        set
        {
            question = value;
        }
    }

    public string Answer
    {
        get
        {
            return answer;
        }

        set
        {
            answer = value;
        }
    }

    public UserT Questioner
    {
        get
        {
            return questioner;
        }

        set
        {
            questioner = value;
        }
    }
    #endregion

    //ctor
    public FAQ()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public FAQ(int code, string quest, string ans)
    {
        ProdCode = code;
        Question = quest;
        Answer = ans;
    }

    public int AddQuestion()
    {
        string strSql = @"INSERT INTO [dbo].[product_FAQ]
                          ([product_code], [question], [questioner])
     VALUES (@code ,@question ,@questioner)";
        SqlParameter parCode = new SqlParameter("@Code", ProdCode);
        SqlParameter parQuestion = new SqlParameter("@question", Question);
        SqlParameter parQuestioner = new SqlParameter("@questioner", Questioner.UserId);
        DbService db = new DbService();
        return db.ExecuteQuery(strSql, CommandType.Text, parCode, parQuestion, parQuestioner);

        
    }

}