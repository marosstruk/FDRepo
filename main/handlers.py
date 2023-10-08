import base64
import json
import requests
import pymongo
from bson import ObjectId
from bson.json_util import dumps

import io


class DatabaseHandler:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["docparser"]
        self.collection = self.db["docs"]

    def get_one(self, id=""):
        return self.collection.find_one({"_id": ObjectId(id)})

    def get_many(self, ids={}):
        return self.collection.find(ids)


class FileUploadHandler:
    @classmethod
    def processFiles(self, files):
        fileIds = []

        for f in files:
            fileIds.append(self.processFile(f))

        return fileIds

    @classmethod
    def processFile(self, f):
        encoded_file = base64.b64encode(f.open().read()).decode('ASCII')
        encoded_file_size = len(encoded_file)
        f.close()

        if encoded_file_size > 20971520:
            raise Exception("The file is too large")

        r = requests.post("http://127.0.0.1:5000/api/parse", json={"Filename": f.name, "File": encoded_file},
                          verify=False)
        j = json.loads(r.content)
        return j["id"]


class DataHandler:
    class Table:
        def __init__(self, headers, rows):
            self.headers = headers
            self.rows = rows


    @classmethod
    def parsePages(self, pages):
        pagesDict = {}
        
        for page in pages:
            pagesDict[page["Num"]] = page["Text"]
        
        return pagesDict
    

    @classmethod
    def parseStructuredData(self, data):
        formattedData = []
        
        for table in data:
            formattedData.append(self.parseTable(table))
        
        return formattedData
                
    
    @classmethod
    def parseTable(self, table):
        def formatNumber(num):
            if type(num) == int or num.isnumeric():
                return f"{num:,}"
            return num
        
        rows = []
        headers = [table["Name"]]

        for col in table["Columns"]:
            headers.append(col["Header"])
            for i, entry in enumerate(col["Entries"]):
                if len(rows) <= i:
                    rows.append([entry["Label"], formatNumber(entry["Value"])])
                else:
                    rows[i].append(formatNumber(entry["Value"]))
        
        return self.Table(headers, rows)
    
    @classmethod
    def formatDataList(self, data):
        class DataRow:
            def __init__(self, id, values):
                self.id = id
                self.values = values
        
        formattedData = []

        for doc in data:
            docData = doc["Data"]
            values = [docData["Company"], docData["RegisteredNumber"], docData["ReportingPeriod"]]
            row = DataRow(doc["_id"].__str__(), values)
            formattedData.append(row)
        
        return formattedData


class FileDownloadHandler:
    def __init__(self, db: DatabaseHandler) -> None:
        self.db = db
    
    def asTxt(self, id: str, pages: list = None):
        d = self.db.get_one(id)
        data = DataHandler.parsePages(d["Data"]["Pages"])
        
        result = io.StringIO("")
        
        for pageNum, text in data.items():
            if pages is None or pageNum in pages:
                result.write("\n" + text)
        
        result.seek(0)
        return result
    
    def asCsv(self, id: str, pagess: list = None):
        pass
    
    def asXlsx(self, id: str, pagess: list = None):
        pass
    
    def asJson(self, id: str, pagess: list = None):
        d = self.db.get_one(id)
        result = io.StringIO(dumps(d["Data"]))
        result.seek(0)
        return result
    
    def asXml(self, id: str, pagess: list = None):
        pass