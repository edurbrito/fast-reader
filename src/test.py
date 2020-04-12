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

def readArgs():
    try:
        pathf = sys.argv[1]
        pathf = os.path.abspath(str(pathf))

        with open(pathf ,"rb") as f:
            pdf = pdftotext.PDF(f)
        return pdf

    except:
        raise ERRORARGS()

def writeToFile(pdf):
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

if __name__ == '__main__':
    try:
        pdf = readArgs()
        writeToFile(pdf)
        print(OK().message, end = '')
        sys.stdout.flush()
    except Exception as error:
        print(error.message, end = '')
        sys.stdout.flush()

    

    