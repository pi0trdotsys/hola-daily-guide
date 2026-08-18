# Przewodnik Hiszpania — aplikacja Android

Aplikacja jest samodzielnym projektem Capacitor (webview offline). Jedyną bazą danych jest plik **`trip.md`** (Markdown).

## Pliki źródłowe

| Plik | Rola |
|------|------|
| `trip.md` | źródło danych (Markdown) — edytuj tutaj treść przewodnika |
| `www/parser.mjs` | parser Markdown → dane |
| `www/index.html`, `www/styles.css`, `www/app.js` | interfejs aplikacji |
| `gen-data.mjs` | generuje `www/data.js` z `trip.md` |
| `android/` | natywny projekt Android (Capacitor) |

Interfejs ma przewiększoną czcionkę oraz przyciski **A− / A+** (górna belka) do zmiany rozmiaru.
Zaznaczanie checklist zapisuje się lokalnie na urządzeniu (localStorage).

## Jak przebudować APK

```bash
cd android-app
npm install                       # tylko za pierwszym razem
node gen-data.mjs                 # wygeneruj dane z trip.md
npx cap sync android             # skopiuj www do projektu Android
cd android
./gradlew assembleRelease        # zbuduj podpisaną wersję release
```

Wynik: `android/app/build/outputs/apk/release/app-release.apk`
(skopiowany też jako `Przewodnik-Hiszpania.apk` w katalogu `android-app/`).

## Podpisywanie

Klucz do podpisywania: `android/release.keystore`
- alias: `hiszpania`
- hasło (store i key): `hiszpania2025`