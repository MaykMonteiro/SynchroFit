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
  return (
    <div>
      <h3 className="font-serif text-[18px] mb-2">{title}</h3>

      <div className="bg-white rounded-md p-4 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={34}>
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

  useEffect(() => {
    let mounted = true;
    api
      .get("/educators/progress/patients")
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
          setSelectedPatient((prev) =>
            prev && data.some((p) => String(p.id) === prev)
              ? prev
              : String(data[0].id)
          );
        }
      })
      .catch(() => {
        // keep empty patients on error
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;
    let mounted = true;
    api
      .get("/educators/progress/reports", {
        params: { patient_id: selectedPatient, type: selectedType },
      })
      .then((res) => {
        if (!mounted) return;
        setReports(res.data || null);
      })
      .catch(() => {
        setReports(null);
      });

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
    <div className="w-full">
      <h1 className="text-center font-serif text-5xl uppercase tracking-wide mb-8">
        RELATÓRIOS
      </h1>

      <div className="bg-[#d9d9d9] rounded-2xl p-6 md:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block font-serif text-[18px] mb-2">
              Paciente
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
              disabled={patients.length === 0}
            >
              {patients.length === 0 ? (
                <option value="" disabled>
                  Carregando pacientes...
                </option>
              ) : (
                patients.map((patient) => (
                  <option key={patient.id} value={String(patient.id)}>
                    {patient.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block font-serif text-[18px] mb-2">
              Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white rounded-md px-4 py-3 outline-none"
            >
              <option value="diet">Dieta</option>
              <option value="workout">Treino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {chartConfig.map((chart) => (
            <ChartCard
              key={chart.title}
              title={chart.title}
              data={chart.data}
              unit={chart.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}