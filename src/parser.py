""" Use pdftotext module to extract text from PDFs. """

import sys
import pdftotext
import os

# Constants & Exceptions
class OK():
    def __init__(self):
        self.message = 0;

class ERRORARGS(Exception): 
    def __init__(self):
        self.message = 1

class ERRORFILE(Exception): 
    def __init__(self):
        self.message = 2

class Parser():

    def readArgs(self, pathf):
        pass
    
    def writeToFile(file):
        pass

class PdfParser(Parser):

    def readArgs(self, pathf):
        try:
            with open(pathf ,"rb") as f:
                pdf = pdftotext.PDF(f)
            return pdf

        except:
            raise ERRORARGS()

    def writeToFile(self, pdf):
        nst = []
        pages = [0,]
        for index, page in enumerate(pdf):
            st = str(page)
            st = st.split(' ')

            for i in st:
                if '-\n' in i:
                    i = i.replace('-\n','')
                if '\n' in i:
                    i = i.split('\n')
                if type(i) is list:
                    for e in i:
                        if e != '':
                            nst.append(e)
                else:
                    if i != '':
                        nst.append(i)
            if pages[len(pages) - 1] == len(nst) - 1:
                nst.append("Blank Page")
            pages.append(len(nst) - 1);

        pathf = "./src/readings.js"

        try:
            f = open(pathf, "w")
            f.write("let npages = " + str(pages) + ";")
            f.write("\nlet text = " + str(nst) + ";")
            f.write("\nmodule.exports = {npages, text};")
            f.close()
        except:
            raise ERRORFILE()

class OtherFileParser(Parser):
    def readArgs(self, pathf):
        try:
            content = [];
            with open(pathf) as f:
                content = f.readlines()

            file = {'npages': [0,], 'text': []}
            for x in content:
                l = str(x).split()
                for i in l:
                    if '-\n' in i:
                        i = i.replace('-\n','')
                    if '\n' in i:
                        i = i.split('\n')
                    if type(i) is list:
                        for e in i:
                            if e != '':
                                file['text'].append(e)
                    else:
                        if i != '':
                            file['text'].append(i)
                if file['npages'][len(file['npages']) - 1] == len(file['text']) - 1:
                    file['text'].append("Blank Page")
                file['npages'].append(len(file['text']) - 1);    
            return file
        except:
            raise ERRORARGS()

    def writeToFile(self, file):
        pathf = "./src/readings.js"
        pages = file['npages']
        try:
            f = open(pathf, "w")
            f.write("let npages = " + str(pages) + ";")
            f.write("\nlet text = " + str(file['text']) + ";")
            f.write("\nmodule.exports = {npages, text};")
            f.close()
        except:
            raise ERRORFILE()

def getExtension(filepath):
    return os.path.splitext(filepath)[1]

if __name__ == '__main__':
    try:
        pathf = sys.argv[1]
        pathf = os.path.abspath(str(pathf))
        
        ext = getExtension(pathf)
        parser = Parser()

        if ext == ".pdf":
            parser = PdfParser()
        else:
            parser = OtherFileParser()
        
        file = parser.readArgs(pathf)
        parser.writeToFile(file)
        
        print(OK().message, end = '')
        sys.stdout.flush()
    except Exception as error:
        print(error.message, end = '')
        sys.stdout.flush()

    

    