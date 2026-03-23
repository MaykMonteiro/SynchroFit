import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { api } from "../services/api";

// data comes from API endpoints: `progress/patients` and `progress/reports`

function ChartCard({ title, data, unit = "" }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full min-w-0">
      <h3 className="mb-2 text-base font-serif">{title}</h3>

      <div className="w-full min-w-0 overflow-hidden rounded-md border border-gray-300 bg-white p-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={safeData} barSize={34}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} ${unit}`.trim(), title]} />
            <Bar dataKey="value" fill="#d6d6d6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Reports() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedType, setSelectedType] = useState("diet");
  const [reports, setReports] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchPatients() {
      try {
        setLoadingPatients(true);

        const res = await api.get("/educators/progress/patients");
        if (!mounted) return;

        const data = Array.isArray(res.data) ? res.data : [];
        setPatients(data);

        if (data.length > 0) {
          setSelectedPatient((prev) =>
            prev && data.some((p) => String(p.id) === prev)
              ? prev
              : String(data[0].id)
          );
        } else {
          setSelectedPatient("");
        }
      } catch {
        if (!mounted) return;
        setPatients([]);
        setSelectedPatient("");
      } finally {
        if (mounted) setLoadingPatients(false);
      }
    }

    fetchPatients();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPatient) {
      setReports(null);
      return;
    }

    let mounted = true;

    async function fetchReports() {
      try {
        setLoadingReports(true);

        const res = await api.get("/educators/progress/reports", {
          params: { patient_id: selectedPatient, type: selectedType },
        });

        if (!mounted) return;
        setReports(res.data || {});
      } catch {
        if (!mounted) return;
        setReports({});
      } finally {
        if (mounted) setLoadingReports(false);
      }
    }

    fetchReports();

    return () => {
      mounted = false;
    };
  }, [selectedPatient, selectedType]);

  const selectedData = useMemo(() => {
    return reports ?? {};
  }, [reports]);

  const chartConfig = useMemo(() => {
    if (selectedType === "diet") {
      return [
        {
          title: "Peso",
          data: selectedData.weight ?? [],
          unit: "kg",
        },
        {
          title: "Calorias",
          data: selectedData.calories ?? [],
          unit: "kcal",
        },
        {
          title: "TMB",
          data: selectedData.tmb ?? [],
          unit: "kcal",
        },
        {
          title: "Gordura Corporal",
          data: selectedData.bodyFat ?? [],
          unit: "%",
        },
      ];
    }

    return [
      {
        title: "Peso",
        data: selectedData.weight ?? [],
        unit: "kg",
      },
      {
        title: "Cargas",
        data: selectedData.loads ?? [],
        unit: "kg",
      },
      {
        title: "Repetições",
        data: selectedData.repetitions ?? [],
        unit: "rep",
      },
      {
        title: "Gordura Corporal",
        data: selectedData.bodyFat ?? [],
        unit: "%",
      },
    ];
  }, [selectedData, selectedType]);

  return (
    <div className="w-full min-w-0">
      <h1 className="text-center font-serif text-4xl uppercase tracking-wide mb-4">
        Relatórios
      </h1>

      <div className="w-full min-w-0 bg-sf-panel rounded-md shadow-soft p-6">
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 min-w-0">
          <div className="min-w-0">
            <label className="mb-1 block text-base font-serif">Paciente</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
              disabled={loadingPatients || patients.length === 0}
            >
              {loadingPatients ? (
                <option value="">Carregando pacientes...</option>
              ) : patients.length === 0 ? (
                <option value="">Nenhum paciente encontrado</option>
              ) : (
                patients.map((patient) => (
                  <option key={patient.id} value={String(patient.id)}>
                    {patient.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="min-w-0">
            <label className="mb-1 block text-base font-serif">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="diet">Dieta</option>
              <option value="workout">Treino</option>
            </select>
          </div>
        </div>

        {loadingReports ? (
          <div className="py-10 text-center text-sm text-gray-600">
            Carregando relatórios...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 min-w-0 w-full">
            {chartConfig.map((chart) => (
              <ChartCard
                key={chart.title}
                title={chart.title}
                data={chart.data}
                unit={chart.unit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}