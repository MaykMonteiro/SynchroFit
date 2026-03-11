import { useMemo } from "react";
import { usePatients } from "../contexts/PatientsContext";
import { useRegistrations } from "../contexts/PatientRegistrationsContext";

function formatDateBR(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

function getDaysLeft(endDate) {
  if (!endDate) return null;

  const today = new Date();
  const end = new Date(endDate);

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diff = end - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatPlan(plan) {
  const plans = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    semiannual: "Semestral",
  };

  return plans[plan] || "-";
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
        <h2 className="mb-2 text-center text-[13px] font-bold">
          PACIENTES A VENCER
        </h2>

        {loading ? (
          <p className="py-6 text-center">Carregando...</p>
        ) : (
          <div className="overflow-hidden border border-gray-500 bg-white">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#9ccd9f]">
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