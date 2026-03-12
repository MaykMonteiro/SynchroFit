import { useMemo } from "react";
import { usePatients } from "../contexts/PatientsContext";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";
import "../styles/table.css";

function parseDateString(dateInput) {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  const s = String(dateInput).trim();

  const dmY = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/;
  const dm = /^\s*(\d{1,2})\/(\d{1,2})\s*$/;

  let m;
  if ((m = s.match(dmY))) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = Number(m[3]);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  if ((m = s.match(dm))) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const today = new Date();
    let year = today.getFullYear();

    let candidate = new Date(year, month - 1, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (candidate < todayMidnight) {
      year += 1;
      candidate = new Date(year, month - 1, day);
    }

    return isNaN(candidate.getTime()) ? null : candidate;
  }

  const isoGuess = new Date(s);
  if (!isNaN(isoGuess.getTime())) return isoGuess;

  return null;
}

function formatDateBR(dateString) {
  const date = parseDateString(dateString);
  if (!date) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getDaysLeft(endDate) {
  const end = parseDateString(endDate);
  if (!end) return null;

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  end.setHours(0, 0, 0, 0);

  const diff = end - todayMidnight;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatPlan(plan) {
  const plans = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    semiannual: "Semestral",
  };

  if (!plan) return "-";

  if (typeof plan === "object") {
    return plan?.description || plan?.name || plans[plan?.type] || "-";
  }

  return plans[plan] || String(plan) || "-";
}

export default function Dashboard() {
  const { patients = [], loading: loadingPatients } = usePatients();
  const { registrations = [], loading: loadingRegistrations } = useRegistrations();

  const loading = loadingPatients || loadingRegistrations;

  const nearestPatients = useMemo(() => {
    const patientMap = new Map(
      (Array.isArray(patients) ? patients : []).map((patient) => [
        String(patient.id),
        patient,
      ])
    );

    return (Array.isArray(registrations) ? registrations : [])
      .map((registration) => {
        const patientId =
          registration?.patient_id ||
          registration?.id_paciente ||
          registration?.patient?.id;

        const patient =
          patientMap.get(String(patientId)) || registration?.patient || {};

        const name =
          patient?.name ||
          patient?.nome ||
          "Paciente";

        const email =
          patient?.email ||
          "-";

        const phone =
          patient?.phone ||
          patient?.telefone ||
          "-";

        const plan =
          registration?.plan_description ||
          "-";

        const endDate =
          registration?.end_date ||
          registration?.data_fim ||
          registration?.expected_end_date ||
          registration?.fim_acompanhamento ||
          registration?.fimAcompanhamento;

        const daysLeft = getDaysLeft(endDate);

        return {
          id: registration?.id,
          name,
          email,
          phone,
          plan,
          endDate,
          daysLeft,
        };
      })
      .filter(
        (item) =>
          item.endDate &&
          item.daysLeft !== null &&
          item.daysLeft >= 0
      )
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 10);
  }, [patients, registrations]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-10 text-center text-3xl font-serif">
        BEM VINDO AO SEU GESTOR DE PACIENTES.
      </h1>

      <div className="mx-auto w-full rounded-md bg-sf-bgGray px-5 py-4">
        <h2 className="mb-2 text-center text-md font-bold">
          PACIENTES A VENCER
        </h2>

        {loading ? (
          <p className="py-6 text-center">Carregando...</p>
        ) : (
          <div className="overflow-hidden border border-gray-500 bg-white">
            <table className="table">
              <thead>
                <tr className="tr">
                  <th className="border border-gray-500 px-2 py-1 text-left">NOME</th>
                  <th className="border border-gray-500 px-2 py-1 text-left">E-MAIL</th>
                  <th className="border border-gray-500 px-2 py-1 text-left">TELEFONE</th>
                  <th className="border border-gray-500 px-2 py-1 text-left">PLANO</th>
                  <th className="border border-gray-500 px-2 py-1 text-left">DATA</th>
                </tr>
              </thead>

              <tbody>
                {nearestPatients.length > 0 ? (
                  nearestPatients.map((patient, index) => (
                    <tr key={patient.id || index}>
                      <td className="border border-gray-500 px-2 py-1">
                        {patient.name}
                      </td>

                      <td className="border border-gray-500 px-2 py-1">
                        {patient.email}
                      </td>

                      <td className="border border-gray-500 px-2 py-1">
                        {patient.phone}
                      </td>

                      <td className="border border-gray-500 px-2 py-1">
                        {formatPlan(patient.plan)}
                      </td>

                      <td className="border border-gray-500 px-2 py-1">
                        {formatDateBR(patient.endDate)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-500 py-4 text-center">
                      Nenhum paciente próximo do prazo final.
                    </td>
                  </tr>
                )}

                {Array.from({ length: Math.max(0, 6 - nearestPatients.length) }).map((_, index) => (
                  <tr key={index}>
                    <td className="border border-gray-500 py-3"></td>
                    <td className="border border-gray-500"></td>
                    <td className="border border-gray-500"></td>
                    <td className="border border-gray-500"></td>
                    <td className="border border-gray-500"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}