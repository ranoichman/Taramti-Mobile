using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

using System.Data.OleDb;
using System.Globalization;
using Microsoft.Office.Interop.Excel;
using System.Runtime.InteropServices;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            OrdDetails();
        }

        private void OrdDetails()
        {
            string[,] values = new string[1, 3];
            //create the Application object we can use in the member functions.
            Microsoft.Office.Interop.Excel.Application _excelApp = new Microsoft.Office.Interop.Excel.Application();
            _excelApp.Visible = false;

            string[] fileName = System.IO.Directory.GetFiles(@"G:\", "*.xlsx");

            //open the workbook
            Workbook workbook = _excelApp.Workbooks.Open(fileName[0],
                Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                Type.Missing, Type.Missing);

            //select the first sheet        
            Worksheet worksheet = (Worksheet)workbook.Worksheets[1];

            //find the used range in worksheet
            Range excelRange = worksheet.get_Range("A:A");

            // בדיקה האם הקובץ פתוח. אם כן, לא נרוץ ונציג למשתמש הודעת שגיאה
            bool wbOpened = ((Microsoft.Office.Interop.Excel.Application)Marshal.GetActiveObject("Excel.Application")).Workbooks.Cast<Workbook>().FirstOrDefault(x => x.Name == workbook.Name) != null;
            if (wbOpened)
            {
                MessageBox.Show("הקובץ הנבחר בשימוש. אנא סגור אותו ונסה שנית.");
            }
            else
            {
                for (int i = 1; i <= worksheet.UsedRange.Rows.Count; i++)
                {
                    excelRange = worksheet.get_Range("A" + i);

                    if (excelRange.Value != null)
                    {
                        if (excelRange.Value.ToString().Substring(0, 3).ToUpper() == "NEW")
                        {
                            //try
                            //{
                            //    excelRange = worksheet.get_Range("B" + i);
                            //    values[0, 0] = excelRange.Value;
                            //    excelRange = worksheet.get_Range("C" + i);
                            //    values[0, 1] = excelRange.Value.ToString();
                            //    excelRange = worksheet.get_Range("D" + i);
                            //    //values[0, 2] = FirstDateOfWeek(DateTime.Now.Year, int.Parse(excelRange.Value.ToString().Substring(5, 2))).ToString("yyMMdd");
                            //    if (excelRange.Value.ToString().Trim().Length == 6)
                            //    {
                            //        values[0, 2] = FirstDateOfWeek(DateTime.Now.Year, int.Parse(excelRange.Value.ToString().Substring(5, 1))).ToString("yyMMdd");
                            //        if (Convert.ToDateTime(values[0, 2].Substring(4, 2) + "/" + values[0, 2].Substring(2, 2) + "/20" + values[0, 2].Substring(0, 2)) < DateTime.Now)
                            //            values[0, 2] = Convert.ToDateTime(values[0, 2].Substring(4, 2) + "/" + values[0, 2].Substring(2, 2) + "/20" + values[0, 2].Substring(0, 2)).AddYears(1).ToString("yyMMdd");
                            //    }
                            //    else
                            //        values[0, 2] = FirstDateOfWeek(DateTime.Now.Year, int.Parse(excelRange.Value.ToString().Substring(5, 2))).ToString("yyMMdd");

                            //    UpdateTbl(values);
                            //}
                            //catch (Exception ex)
                            //{
                            //    MessageBox.Show(ex.Message);
                            //    throw;
                            //}
                        }
                    }
                }
            }

            workbook.Close(true, Type.Missing, Type.Missing);
            //releaseObject(worksheet);
            //releaseObject(workbook);
            // מחיקת כל הקבצים בתיקייה בתנאי שהקובץ              
            System.IO.DirectoryInfo directory = new System.IO.DirectoryInfo(@"T:\AA_TAPI\Orders from India");
            System.IO.File.Copy(fileName[0], @"T:\AA_TAPI\Orders from India\History\" + DateTime.Now.ToString("dd.MM.yyyy_HH.mm") + ".xlsx");

            if (wbOpened)
            {
                Environment.Exit(1);
            }
            else
            {
                foreach (System.IO.FileInfo file in directory.GetFiles())
                    try
                    {
                        file.Delete();
                    }
                    catch (Exception e)
                    {
                        MessageBox.Show(e.Message);
                        throw;
                    }
            }
        }
    }
}
