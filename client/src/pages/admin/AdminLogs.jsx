// src/pages/admin/AdminLogs.jsx
import React, { useEffect, useState } from 'react';
import styles from '../AdminHome.module.css';
import BackButton from '../../components/BackButton';
import ToggleMenu from '../../components/ToggleMenu';
import { getLockEvents } from '../../services/api';
import { FaLock, FaUnlock } from 'react-icons/fa';

function AdminLogs() {
    const [logs, setLogs] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [deviceNames, setDeviceNames] = useState({});

    const toggleMenu = (open) => setMenuOpen(open);

    useEffect(() => {
        const fetchEventsAndDevices = async () => {
            console.log("🟡 Iniciando carga de cerraduras y eventos...");
            const sessionToken = localStorage.getItem("sessionToken");

            if (!sessionToken) {
                console.warn("❌ No hay sessionToken en localStorage");
                return;
            }

            try {
                console.log("🔐 Usando token:", sessionToken);

                const hostRes = await fetch("https://localhost:8443/api/me/locks", {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                });

                if (!hostRes.ok) {
                    const errorText = await hostRes.text();
                    console.error(`❌ Error al obtener cerraduras: (${hostRes.status}) ${errorText}`);
                    return;
                }

                const locks = await hostRes.json();
                console.log("✅ Cerraduras obtenidas:", locks);

                const lockMap = {};
                locks.forEach((lock) => {
                    lockMap[lock.id] = lock.name;
                });
                setDeviceNames(lockMap);

                const events = await getLockEvents();
                console.log("✅ Eventos obtenidos:", events);

                const sorted = events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setEvents(sorted);
            } catch (error) {
                console.error("❌ Error inesperado al cargar eventos o cerraduras:", error);
            }
        };

        fetchEventsAndDevices();
    }, []);

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
        });
    };

    //FUNCIONES PARA DESCARGAR EL ACCESO
    const downloadCSV = () => {
        const header = ['Fecha', 'Evento', 'Cerradura'];
        const rows = events.map((log) => [
            formatDate(log.created_at),
            log.event_type === 'lock.locked' ? 'Cerrado' : 'Abierto',
            deviceNames[log.device_id] || log.device_id,
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [header, ...rows].map((e) => e.join(',')).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'registro_cerraduras.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        window.print(); // Solución rápida: imprime/exporta como PDF desde navegador
    };
    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.navContainer}>
                    <BackButton to="/admin/home" />
                    <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
                </div>

                <div className={styles.mainContent}>
                    <h1 className={styles.greeting}>Historial de accesos</h1>
                    <p className={styles.subtitle}>¿Quieres descargar este registro?</p>
                    <div style={{ marginBottom: '1rem' }}>
                        <button className={styles.exportBtn} onClick={downloadCSV}>📄 Descargar CSV</button>
                        <button className={styles.exportBtn} onClick={downloadPDF}>🖨️ Imprimir / PDF</button>
                    </div>

                    {events.length === 0 ? (
                        <p className={styles.subtitle}>No hay eventos registrados.</p>
                    ) : (
                        <div className={styles.logsWrapper}>
                            <table className={styles.logsTable}>
                                <thead>
                                    <tr>
                                        <th>📅 Fecha</th>
                                        <th>🔒 Evento</th>
                                        <th>🔐 Cerradura</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.slice(0, 6).map((log, idx) => (
                                        <tr key={idx}>
                                            <td>{formatDate(log.created_at)}</td>
                                            <td
                                                className={
                                                    log.event_type === 'lock.locked'
                                                        ? styles.lockedEvent
                                                        : styles.unlockedEvent
                                                }
                                            >
                                                {log.event_type === 'lock.locked' ? (
                                                    <>
                                                        <FaLock style={{ marginRight: '6px' }} /> Cerrado
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUnlock style={{ marginRight: '6px' }} /> Abierto
                                                    </>
                                                )}
                                            </td>
                                            <td>{deviceNames[log.device_id] || log.device_id}</td>
                                        </tr>
                                    ))}
                                    {events.length > 6 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>...</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                            <br></br>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminLogs;