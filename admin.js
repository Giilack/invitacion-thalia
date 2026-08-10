// ==========================================
// CLIENTE SUPABASE
// ==========================================

const supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
);


// ==========================================
// ELEMENTOS
// ==========================================

const loginScreen =
    document.getElementById("loginScreen");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const refreshButton =
    document.getElementById("refreshButton");

const table =
    document.getElementById("registrationsTable");

const emptyState =
    document.getElementById("emptyState");


// ==========================================
// COMPROBAR SESIÓN
// ==========================================

async function checkSession() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session) {

        showDashboard();

    } else {

        showLogin();

    }

}


// ==========================================
// MOSTRAR LOGIN
// ==========================================

function showLogin() {

    loginScreen.classList.remove("hidden");

    dashboard.classList.add("hidden");

}


// ==========================================
// MOSTRAR PANEL
// ==========================================

async function showDashboard() {

    loginScreen.classList.add("hidden");

    dashboard.classList.remove("hidden");

    await loadRegistrations();

}


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();


        const password =
            document.getElementById("password").value;


        loginMessage.textContent =
            "Iniciando sesión...";


        const {
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            console.error(error);

            loginMessage.textContent =
                "Correo o contraseña incorrectos.";

            return;

        }


        loginMessage.textContent = "";

        showDashboard();

    }
);


// ==========================================
// CERRAR SESIÓN
// ==========================================

logoutButton.addEventListener(
    "click",
    async function () {

        await supabaseClient.auth.signOut();

        showLogin();

    }
);


// ==========================================
// CARGAR REGISTRADOS
// ==========================================

async function loadRegistrations() {

    const {
        data,
        error
    } = await supabaseClient

        .from("confirmaciones")

        .select(
            "id, nombre, apellido, asistencia, creado_en"
        )

        .order(
            "creado_en",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(error);

        table.innerHTML = "";

        emptyState.textContent =
            "No se pudieron cargar las confirmaciones.";

        emptyState.style.display =
            "block";

        return;

    }


    renderRegistrations(data);

}


// ==========================================
// MOSTRAR REGISTRADOS
// ==========================================

function renderRegistrations(data) {

    table.innerHTML = "";


    if (!data || data.length === 0) {

        emptyState.textContent =
            "Todavía no hay confirmaciones.";

        emptyState.style.display =
            "block";

        updateStats([]);

        return;

    }


    emptyState.style.display =
        "none";


    data.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            const fecha =
                item.creado_en
                    ? new Date(item.creado_en)
                        .toLocaleString(
                            "es-PE",
                            {
                                dateStyle: "short",
                                timeStyle: "short"
                            }
                        )
                    : "-";


            const asistenciaSi =
                item.asistencia === "Sí, asistiré";


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(item.nombre)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(item.apellido)}
                </td>

                <td>

                    <span class="badge ${
                        asistenciaSi
                            ? "yes"
                            : "no"
                    }">

                        ${
                            asistenciaSi
                                ? "✓ Sí, asistirá"
                                : "✕ No asistirá"
                        }

                    </span>

                </td>

                <td>
                    ${fecha}
                </td>

            `;


            table.appendChild(row);

        }
    );


    updateStats(data);

}


// ==========================================
// ESTADÍSTICAS
// ==========================================

function updateStats(data) {

    const total =
        data.length;


    const yes =
        data.filter(
            item =>
                item.asistencia === "Sí, asistiré"
        ).length;


    const no =
        data.filter(
            item =>
                item.asistencia === "No podré asistir"
        ).length;


    document.getElementById("total")
        .textContent = total;


    document.getElementById("yes")
        .textContent = yes;


    document.getElementById("no")
        .textContent = no;

}


// ==========================================
// ACTUALIZAR MANUALMENTE
// ==========================================

refreshButton.addEventListener(
    "click",
    async function () {

        refreshButton.textContent =
            "Actualizando...";


        await loadRegistrations();


        refreshButton.textContent =
            "↻ Actualizar";

    }
);


// ==========================================
// TIEMPO REAL
// ==========================================

supabaseClient
    .channel("confirmaciones-en-vivo")

    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "confirmaciones"
        },
        function () {

            loadRegistrations();

        }
    )

    .subscribe();


// ==========================================
// SEGURIDAD HTML
// ==========================================

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ==========================================
// INICIAR
// ==========================================

checkSession();