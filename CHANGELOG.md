# 📝 ZERO TIME 2.0 - CHANGELOG

## Versione 2.0 (Febbraio 2025)

### 🔄 COMUNICAZIONE OTTIMIZZATA

#### **Problema risolto:**
Il device ZERO TIME si bloccava con troppi dati in ricezione.

#### **Soluzione implementata:**
Comunicazione unidirezionale APP → DEVICE (solo invio comandi)

---

## 🆕 NOVITÀ PRINCIPALI

### 1. 💾 **CONFIGURAZIONE IN LOCALSTORAGE**

**Modifiche:**
- ✅ Tutte le impostazioni salvate in localStorage
- ✅ Rimossa richiesta `GET_CONFIG` dopo connessione
- ✅ Funzione `loadConfigFromStorage()` carica da cache
- ✅ App mantiene stato anche offline

**Chiavi localStorage:**
```javascript
zt_beep          // Soglia BEEP
zt_shot          // Soglia SHOT  
zt_timer         // Timer secondi
zt_mic           // Microfono ON/OFF
zt_bt            // Bluetooth ON/OFF
zt_offset        // Offset livella
zt_brightness    // Luminosità 1-5
zt_beep_pattern  // Pattern audio BEEP
zt_shot_pattern  // Pattern audio SHOT
```

### 2. 📤 **INVIO COMANDI OTTIMIZZATO**

**Modifiche funzione `saveBtn.onclick`:**
- ✅ Salva in localStorage PRIMA di inviare
- ✅ Pause di 50ms tra ogni comando
- ✅ Try-catch per gestire errori senza bloccare
- ✅ Feedback: "Salvato in app + Inviato a device"

**Sequenza invio:**
```
SET_BEEP → [50ms] → SET_SHOT → [50ms] → 
SET_TIMER → [50ms] → SET_MIC → [50ms] → 
SET_BT → [50ms] → SET_OFFSET → [50ms] → SAVE
```

### 3. 🔌 **FUNZIONAMENTO OFFLINE**

**Modifiche:**
- ✅ Tab Calcolatore/Range Card/Salvati sempre disponibili
- ✅ Configurazione Timer modificabile offline
- ✅ Auto-Learning salva pattern in localStorage
- ✅ Device si connette solo per applicare modifiche

### 4. 📝 **RINOMINA DEVICE**

**Nuova funzionalità:**
- ✅ Campo input "Nome Device" dopo connessione BT
- ✅ Nome salvato in `localStorage.zerotime_device_name`
- ✅ Status bar mostra: "CONNESSO: Il mio ZERO TIME"
- ✅ Nome persiste tra sessioni

### 5. 🎯 **ICONE PWA CORRETTE**

**Modifiche `manifest.json`:**
```json
{
  "icons": [
    {
      "src": "./icon-192.png",  // Path relativo
      "src": "./icon-512.png"   // Funziona ovunque
    }
  ]
}
```

---

## 🔧 MODIFICHE TECNICHE

### **Funzione `connectBtn.onclick`:**

**PRIMA:**
```javascript
await sendCommand('GET_CONFIG');  // Richiesta dati
// Attesa risposta
// Parsing risposta
```

**ORA:**
```javascript
loadConfigFromStorage();  // Carica da localStorage
console.log('✅ Connesso - solo invio comandi');
// Nessuna richiesta al device
```

### **Funzione `handleNotification`:**

**PRIMA:**
```javascript
// Parsing complesso di tutte le risposte
if (value.startsWith('BRIGHTNESS:')) { ... }
if (value.startsWith('OK:BRIGHTNESS:')) { ... }
// Molte altre condizioni...
```

**ORA:**
```javascript
console.log('📥 Ricevuto (informativo):', value);
// Solo log, niente parsing pesante
```

### **Funzione `setBrightness`:**

**PRIMA:**
```javascript
if (!characteristic) {
    alert('⚠️ Connetti prima il dispositivo!');
    return;
}
await sendCommand('SET_BRIGHTNESS', level);
```

**ORA:**
```javascript
localStorage.setItem('zt_brightness', level.toString());
updateBrightnessUI(level);  // Aggiorna UI subito

if (characteristic) {
    await sendCommand('SET_BRIGHTNESS', level);
} else {
    console.log('Salvato offline');
}
```

### **Funzione `savePattern` (Auto-Learning):**

**PRIMA:**
```javascript
await characteristic.writeValue(data);
// Attende scrittura
statusEl.textContent = '✅ Salvato!';
```

**ORA:**
```javascript
// Salva pattern in localStorage
localStorage.setItem(patternKey, JSON.stringify(pattern));

if (characteristic) {
    await characteristic.writeValue(data);
    statusEl.textContent = '✅ Salvato in app + device!';
} else {
    statusEl.textContent = '💾 Salvato in app';
}
```

### **Funzione `factoryBtn.onclick`:**

**PRIMA:**
```javascript
await sendCommand('FACTORY_RESET');
// Reset solo UI
```

**ORA:**
```javascript
// Reset localStorage
localStorage.setItem('zt_beep', '8000');
localStorage.setItem('zt_shot', '12000');
// ...

// Reset UI
beepThreshold.value = 8000;
// ...

// Invia reset al device solo se connesso
if (characteristic) {
    await sendCommand('FACTORY_RESET');
}
```

---

## 📊 CONFRONTO PRESTAZIONI

| Caratteristica | v1.0 | v2.0 |
|---------------|------|------|
| **Richieste GET** | ✅ Sì | ❌ No |
| **Attesa risposte** | ✅ Sì | ❌ No |
| **Parsing ricezione** | ✅ Pesante | ⚠️ Minimo |
| **LocalStorage** | ⚠️ Parziale | ✅ Completo |
| **Offline mode** | ⚠️ Limitato | ✅ Totale |
| **Pause tra comandi** | ❌ No | ✅ 50ms |
| **Device si blocca** | ⚠️ Possibile | ✅ Risolto |
| **Feedback immediato** | ❌ No | ✅ Sì |

---

## 🐛 BUG RISOLTI

### **Bug #1: Device sovraccarico**
- **Causa:** Troppe richieste GET e parsing risposte
- **Fix:** Comunicazione one-way + localStorage

### **Bug #2: Icona PWA non corretta**
- **Causa:** Path assoluti nel manifest.json
- **Fix:** Path relativi `./icon-192.png`

### **Bug #3: Configurazione persa offline**
- **Causa:** Nessun backup in localStorage
- **Fix:** Tutto salvato in localStorage

### **Bug #4: Auto-Learning solo online**
- **Causa:** Pattern inviati solo al device
- **Fix:** Pattern salvati anche in localStorage

---

## 📈 MIGLIORAMENTI FUTURI (POSSIBILI)

- [ ] Sync pattern tra più device
- [ ] Export/Import configurazione completa
- [ ] Backup automatico su cloud
- [ ] Statistiche utilizzo
- [ ] Notifiche push per aggiornamenti firmware

---

## 🔗 LINK UTILI

- **Repository GitHub:** (inserisci URL)
- **Live Demo:** (inserisci URL GitHub Pages)
- **Documentazione:** README_GITHUB.md
- **Quick Start:** GITHUB_DEPLOY.txt
- **Website:** shooting-labs.com

---

## 👨‍💻 CREDITI

**Sviluppato da:** Nicholas / Shooting Labs
**Versione:** 2.0
**Data:** Febbraio 2025
**Licenza:** (da definire)

---

## 📞 SUPPORTO

Per bug, domande o suggerimenti:
- **Email:** (inserisci email)
- **Website:** shooting-labs.com
- **GitHub Issues:** (inserisci URL/issues)

---

*ZERO TIME 2.0 - Precision Timer for Shooting Sports*
*Developed with ❤️ by Shooting Labs*
