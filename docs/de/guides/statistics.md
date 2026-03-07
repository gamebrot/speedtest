# Statistiken & Diagramme

MySpeed bietet detaillierte Statistiken und Diagramme, um deine Internetverbindung über die Zeit zu analysieren. Diese Seite erklärt, wie die Statistikfunktion arbeitet und wie Daten für eine optimale Darstellung verarbeitet werden.

## Übersicht

Die Statistikseite zeigt deine Speedtest-Ergebnisse in verschiedenen Diagrammen an, darunter Download-/Upload-Geschwindigkeiten, Ping und Jitter über die Zeit. Um auch bei großen Datenmengen eine flüssige Darstellung zu gewährleisten, verwendet MySpeed eine intelligente Datenverarbeitung.

## Datumsbereich-Auswahl

Du kannst einen benutzerdefinierten Datumsbereich über die Datumsauswahl oben auf der Statistikseite auswählen. Standardmäßig werden die letzten 7 Tage angezeigt, aber du kannst dies erweitern, um längere Zeiträume zu betrachten.

## Intelligentes Downsampling

Wenn du viele Speedtests hast (zum Beispiel Tests jede Minute), würde die Anzeige aller Datenpunkte die Diagramme erheblich verlangsamen. MySpeed handhabt dies automatisch mit intelligentem Downsampling.

### Wie es funktioniert

1. **Schwellenwert-Prüfung**: Wenn dein ausgewählter Datumsbereich **300 oder weniger** Datenpunkte enthält, werden alle Rohdaten ohne Verarbeitung angezeigt.

2. **Bucket-basierte Mittelwertbildung**: Bei mehr als 300 Datenpunkten wird der Zeitraum in 300 gleiche Zeitabschnitte (Buckets) unterteilt. Jeder Bucket enthält den Durchschnitt aller Tests, die während dieses Zeitraums stattfanden.

3. **Fehlgeschlagene Tests**: Fehlgeschlagene Tests werden separat verfolgt. Wenn ein Zeitabschnitt nur fehlgeschlagene Tests enthält, wird eine Fehlermarkierung angezeigt. Wenn ein Bucket sowohl erfolgreiche als auch fehlgeschlagene Tests hat, werden die erfolgreichen Tests gemittelt und die Anzahl der Fehlschläge notiert.

### Beispielszenarien

| Testhäufigkeit | Tests pro Woche | Verhalten |
|----------------|-----------------|-----------|
| Jede Stunde | ~168 | Alle Rohdaten angezeigt |
| Alle 30 Min | ~336 | Leichtes Downsampling (300 Punkte) |
| Alle 10 Min | ~1.008 | Jeder Punkt repräsentiert ~3,4 Tests |
| Jede Minute | ~10.080 | Jeder Punkt repräsentiert ~34 Tests |

## Fehlgeschlagene Tests in Diagrammen

Fehlgeschlagene Speedtests werden mit speziellen roten **✕**-Markierungen am unteren Rand des Diagramms angezeigt. Dies macht es einfach zu erkennen, wann deine Verbindung Probleme hatte.

::: info Aggregierte fehlgeschlagene Tests
Wenn Daten herunterskaliert werden, zeigt der Tooltip an, wie viele Tests während dieses Zeitraums fehlgeschlagen sind (z.B. "3 failed in period").
:::

## Diagrammtypen

### Geschwindigkeits-Diagramme
Zeigt Download- und Upload-Geschwindigkeiten über die Zeit mit einer Farbverlaufsfüllung. Eine gestrichelte Linie zeigt die Durchschnittsgeschwindigkeit für den ausgewählten Zeitraum an.

### Ping-Diagramm
Zeigt Ping-Latenz und Jitter (falls verfügbar) über die Zeit an. Niedrigere Werte bedeuten eine reaktionsschnellere Verbindung.

### Stündliche Durchschnitte
Zeigt Durchschnittsgeschwindigkeiten gruppiert nach Tageszeit, um Muster wie langsamere Geschwindigkeiten während Stoßzeiten zu erkennen.

### Stabilitäts-Diagramm
Visualisiert, wie stabil deine Verbindung ist, basierend auf der Standardabweichung deiner Testergebnisse.

## Leistungsüberlegungen

Das Ziel von 300 Punkten wurde gewählt, um Detail und Leistung auszubalancieren:

- **Genug Detail**, um Trends und Anomalien zu erkennen
- **Schnelles Rendering** auch auf mobilen Geräten
- **Flüssige Interaktionen** beim Überfahren der Datenpunkte

::: tip Große Datumsbereiche
Bei sehr langen Datumsbereichen (Monate oder Jahre) wird das Downsampling mehr Tests pro Datenpunkt mitteln. Erwäge, kürzere Datumsbereiche auszuwählen, wenn du einzelne Testdetails sehen möchtest.
:::
