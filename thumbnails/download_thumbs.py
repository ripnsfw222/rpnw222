import requests
import os

# Cria a pasta se não existir
os.makedirs("thumbnails", exist_ok=True)

# Lista de thumbnails para teste
thumbs = [
    "https://postercdn.com/splash/ek5wqn9tv0jzalv1.jpg",
    "https://postercdn.com/splash/864t23xnbxwgbtq0.jpg",
    "https://postercdn.com/splash/d8xrsrw3684x57qd.jpg"
]

for url in thumbs:
    filename = url.split("/")[-1]
    path = os.path.join("thumbnails", filename)
    
    try:
        r = requests.get(url, stream=True, timeout=10)
        if r.status_code == 200:
            with open(path, "wb") as f:
                for chunk in r.iter_content(1024):
                    f.write(chunk)
            print(f"✅ Baixado: {filename}")
        else:
            print(f"❌ Falha: {filename} ({r.status_code})")
    except Exception as e:
        print(f"❌ Erro: {filename} ({e})")
