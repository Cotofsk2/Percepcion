const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtTfk32a2Cvwjx4CLx-2QSc2XJUMcilc1D9U4kToGsZIUIoOnptNhIfcqeFJZE-Ra6/exec";

function nextScreen(currentId, nextId) {
    const currentScreen = document.getElementById(currentId);
    const nextScreen = document.getElementById(nextId);

    // Validación si estamos en una pantalla con input
    if (currentId.startsWith('screen-') && currentId !== 'screen-intro') {
        const inputId = currentId.replace('screen-', 'word-');
        const inputElement = document.getElementById(inputId);
        if (inputElement && inputElement.value.trim() === '') {
            inputElement.style.animation = 'shake 0.4s ease';
            setTimeout(() => inputElement.style.animation = '', 400);
            inputElement.focus();
            return;
        }
    }

    currentScreen.classList.remove('active');
    currentScreen.classList.add('fade-out');

    setTimeout(() => {
        currentScreen.classList.remove('fade-out');
        
        nextScreen.classList.add('fade-in');
        
        // Forzar reflow para que la animación funcione
        void nextScreen.offsetWidth;
        
        nextScreen.classList.remove('fade-in');
        nextScreen.classList.add('active');

        const nextInputId = nextId.replace('screen-', 'word-');
        const nextInput = document.getElementById(nextInputId);
        if (nextInput) {
            setTimeout(() => nextInput.focus(), 1000); // Esperar a que termine la animación
        }
    }, 1000); // Coincide con la duración de la transición CSS
}

async function submitData() {
    const wordKey = document.getElementById('word-key').value.trim();
    const wordDoor = document.getElementById('word-door').value.trim();
    const wordCandle = document.getElementById('word-candle').value.trim();

    if (!wordCandle) {
        const inputElement = document.getElementById('word-candle');
        inputElement.style.animation = 'shake 0.4s ease';
        setTimeout(() => inputElement.style.animation = '', 400);
        inputElement.focus();
        return;
    }

    document.getElementById('loading').classList.add('active');

    const data = {
        llave: wordKey,
        puerta: wordDoor,
        vela: wordCandle
    };

    try {
        if (SCRIPT_URL === "REEMPLAZAR_CON_URL_DE_APPS_SCRIPT") {
            console.log("Modo de prueba. Datos simulados:", data);
            // Simular carga para probar el flujo sin el script configurado
            setTimeout(() => finishFlow(), 1500);
            return;
        }

        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        finishFlow();

    } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("Hubo un problema guardando tu respuesta. Por favor intenta de nuevo.");
        document.getElementById('loading').classList.remove('active');
    }
}

function finishFlow() {
    document.getElementById('loading').classList.remove('active');
        
    const currentScreen = document.getElementById('screen-candle');
    const thanksScreen = document.getElementById('screen-thanks');
    
    currentScreen.classList.remove('active');
    currentScreen.classList.add('fade-out');
    
    setTimeout(() => {
        currentScreen.classList.remove('fade-out');
        thanksScreen.classList.add('active');
    }, 1000);
}

// Agregar la animación de shake dinámicamente
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}`;
document.head.appendChild(style);

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;
        
        const button = activeScreen.querySelector('.btn');
        if (button) {
            button.click();
        }
    }
});
