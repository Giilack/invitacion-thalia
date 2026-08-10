const eventDate = new Date("2026-09-05T19:30:00-05:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = eventDate - now;

    const ids = ["days", "hours", "minutes", "seconds"];

    if (distance <= 0) {
        ids.forEach(id => {
            document.getElementById(id).textContent = "00";
        });
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// SUPABASE
// ==========================================

const form = document.getElementById("rsvpForm");
const message = document.getElementById("formMessage");

let supabaseClient = null;

const validConfig =
    window.SUPABASE_URL &&
    window.SUPABASE_ANON_KEY &&
    !window.SUPABASE_URL.includes("PEGA_AQUI") &&
    !window.SUPABASE_ANON_KEY.includes("PEGA_AQUI");

if (validConfig && window.supabase) {

    supabaseClient = window.supabase.createClient(
        window.SUPABASE_URL,
        window.SUPABASE_ANON_KEY
    );

}


// ==========================================
// CONFIRMACION DE ASISTENCIA
// ==========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre =
        document.getElementById("nombre").value.trim();

    const apellido =
        document.getElementById("apellido").value.trim();

    const asistencia =
        document.getElementById("asistencia").value;


    if (!nombre || !apellido || !asistencia) {

        message.textContent =
            "Completa todos los campos.";

        return;
    }


    const button =
        form.querySelector("button[type=submit]");


    button.disabled = true;
    button.textContent = "Guardando...";


    try {

        if (!supabaseClient) {

            throw new Error(
                "Supabase no está configurado correctamente."
            );

        }


        // IMPORTANTE:
        // NO usamos .select()
        // porque los invitados no tienen permiso SELECT.

        const { error } =
            await supabaseClient
                .from("confirmaciones")
                .insert([
                    {
                        nombre: nombre,
                        apellido: apellido,
                        asistencia: asistencia
                    }
                ]);


        if (error) {

            console.error(
                "ERROR REAL DE SUPABASE:",
                error
            );

            throw error;
        }


        message.textContent =
            "¡Gracias! Tu confirmación fue registrada. ✨";


        form.reset();


    } catch (error) {

        console.error(
            "Error completo:",
            error
        );


        message.textContent =
            "Error: " +
            (
                error.message ||
                "No se pudo guardar la confirmación."
            );


    } finally {

        button.disabled = false;

        button.textContent =
            "Enviar confirmación";

    }

});


// ==========================================
// COMPARTIR INVITACION
// ==========================================

document
    .getElementById("shareBtn")
    .addEventListener("click", async () => {

        const data = {

            title:
                "Invitación · Thalia 17 años",

            text:
                "✨ Estás invitado/a a celebrar los 17 años de Thalia. Mira la invitación y confirma tu asistencia:",

            url:
                window.location.href

        };


        try {

            if (navigator.share) {

                await navigator.share(data);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "¡Enlace copiado! Ya puedes enviarlo por WhatsApp."
                );

            }

        } catch (_) {

            // El usuario canceló el compartir

        }

    });
