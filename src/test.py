"""Use pdftotext to extract text from PDFs."""

import sys
import pdftotext
import os

pathf = sys.argv[1]
pathf = os.path.abspath(str(pathf))
with open(pathf ,"rb") as f:
    pdf = pdftotext.PDF(f)

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
    pages.append(len(nst) - 1);

pathf = "./src/readings.js"
f = open(pathf, "w")
f.write("let npages = " + str(pages) + ";")
f.write("\nlet text = " + str(nst) + ";")
f.write("\nmodule.exports = {npages, text};")
# for i in nst:
#     f.write(i + '\n')
f.close()
print(0, end = '')
sys.stdout.flush()