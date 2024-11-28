
// TOKEN_KEY: Define una clave (authToken) para identificar el token dentro de localStorage.
// guardarToken(token): Guarda el token en localStorage bajo la clave definida.
// obtenerToken(): Recupera el token desde localStorage.
// eliminarToken(): Borra el token almacenado.
// tokenExiste(): Verifica si el token está presente, devolviendo true o false.

const TOKEN_KEY = 'authToken';

export function guardarToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function eliminarToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function tokenExiste() {
    return !!obtenerToken();
}
