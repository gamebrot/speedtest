# Fehlerbehebung

In diesem Guide erfährst du, wie du bekannte Fehler mit diesem Dienst behebst.

::: danger Could not open the database file. Maybe it is damaged?
Bei diesem Fehler kann es mehrere Lösungen geben. Arbeite einfach alle Möglichkeiten durch und dein Problem sollte
gelöst sein. :)

1. Berechtigungen setzen   
   Um die Berechtigungen zu setzen, gib den Befehl `chmod 700 /opt/myspeed` ein. (Ersetze /opt/myspeed mit deinem
   Installationsort)

2. Führe eine Neuinstallation der Abhängigkeiten aus   
   Führe `bun install` im Installationsordner aus, um alle Abhängigkeiten neu zu laden.
   :::

::: danger Diese MySpeed-Instanz befindet sich aktuell im Entwicklungsmodus
Das bedeutet, dass der Client-Build-Ordner nicht gefunden wurde. Wenn du aus dem Quellcode installiert hast, stelle sicher, dass du zuerst den Client baust:
```sh
cd client && npm install && npm run build && cd .. && mv client/build .
```
Alternativ kannst du ein fertiges Release herunterladen oder Docker verwenden.
Lies dir auch mal den [Guide zur 24/7 Installation](setup/linux) durch, wenn du planst, MySpeed im Hintergrund laufen zu lassen und beim Systemstart automatisch hochzufahren.
:::