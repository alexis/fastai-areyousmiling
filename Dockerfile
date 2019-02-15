FROM python:3.7-slim-stretch

RUN apt-get update && apt-get install -y git python3-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt --upgrade

RUN mkdir -p app/static app/models
COPY app/server.py app/

ENV TORCH_HOME /tmp/.torch
RUN python app/server.py

COPY app app/

EXPOSE 5042

CMD ["python", "app/server.py", "serve"]
