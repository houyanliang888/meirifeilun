import subprocess, urllib.parse, os, shutil

d = r"C:/Users/Administrator/WorkBuddy/社会百科/每天三件事"
html = os.path.join(d, "手机海报.html")
tmp = os.path.join(d, "poster_qr.html")
shutil.copy(html, tmp)  # 同目录副本，qrcode.png 相对引用仍有效

fileurl = "file:///" + urllib.parse.quote(tmp.replace("\\", "/"), safe='/:')
out = os.path.join(d, "_poster_out.png")
ms = r"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
r = subprocess.run([ms, "--headless=new", "--no-sandbox", "--disable-gpu",
                    "--hide-scrollbars", "--virtual-time-budget=5000",
                    "--window-size=1080,1920", "--screenshot=" + out, fileurl],
                   capture_output=True, text=True)
print("edge rc", r.returncode)
if r.stderr:
    print("stderr tail:", r.stderr[-400:])

if os.path.exists(out):
    final = os.path.join(d, "手机海报.png")
    shutil.move(out, final)
    print("saved", final, os.path.getsize(final), "bytes")
else:
    print("截图未生成！")
os.remove(tmp)
