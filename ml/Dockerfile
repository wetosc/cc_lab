FROM fastgenomics/sklearn:latest

WORKDIR /app

COPY requirements.txt ./

RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "main.py"]e