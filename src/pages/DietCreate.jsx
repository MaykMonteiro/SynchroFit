import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function DietCreate() {
  const nav = useNavigate();

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);

  const [form, setForm] = useState({
    patient_id: "",
    objective: "",
    calories: "",
    diet_type: "",
    goal_weight: "",
    carbohydrates: "",
    proteins: "",
    fats: "",
    start_date: "",
    end_date: "",
    finalized_at: "",
  });

  const [items, setItems] = useState([
    {
      meals_id: "",
      food_id: "",
      meal_time: "",
      quantity: "",
      measure: "gr",
      others: "",
    },
  ]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoadingPage(true);

      const [patientsRes, foodsRes, mealsRes] = await Promise.all([
        api.get("/educators/patients/for-educator").catch(() => null),
        api.get("/educators/foods").catch(() => null),
        api.get("/educators/meals").catch(() => null),
      ]);

      const patientsData =
        patientsRes?.data?.patients ??
        patientsRes?.data?.Patients ??
        patientsRes?.data?.data ??
        patientsRes?.data ??
        [];

      const foodsData =
        foodsRes?.data?.foodData ||
        foodsRes?.data?.foods ||
        foodsRes?.data?.message ||
        foodsRes?.data?.data ||
        [];

      const mealsData =
        mealsRes?.data?.mealData ||
        mealsRes?.data?.["mealData:"] ||
        mealsRes?.data?.meals ||
        mealsRes?.data?.data ||
        [];

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setFoods(Array.isArray(foodsData) ? foodsData : []);
      setMeals(Array.isArray(mealsData) ? mealsData : []);
    } catch (error) {
      console.error("Erro ao carregar dados da tela de dieta:", error);
      console.error("Resposta backend:", error.response?.data);
      alert("Erro ao carregar pacientes, alimentos ou refeições.");
    } finally {
      setLoadingPage(false);
    }
  }

  function setField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        meals_id: "",
        food_id: "",
        meal_time: "",
        quantity: "",
        measure: "gr",
        others: "",
      },
    ]);
  }

  function removeItem(index) {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function getPatientId(patient) {
    return patient.id ?? patient.patient_id;
  }

  function getPatientName(patient) {
    return patient.name ?? patient.nome ?? "Paciente";
  }

  function validateForm() {
    if (!form.patient_id) {
      alert("Selecione o paciente.");
      return false;
    }

    if (!form.calories) {
      alert("Preencha as calorias.");
      return false;
    }

    if (!form.proteins) {
      alert("Preencha as proteínas.");
      return false;
    }

    if (!form.carbohydrates) {
      alert("Preencha os carboidratos.");
      return false;
    }

    if (!form.fats) {
      alert("Preencha as gorduras.");
      return false;
    }

    if (!form.start_date) {
      alert("Preencha a data de início da dieta.");
      return false;
    }

    if (!form.end_date) {
      alert("Preencha a data de fim da dieta.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.meals_id) {
        alert(`Selecione a refeição do item ${i + 1}.`);
        return false;
      }

      if (!item.food_id) {
        alert(`Selecione o alimento do item ${i + 1}.`);
        return false;
      }

      if (!item.meal_time) {
        alert(`Preencha o horário da refeição do item ${i + 1}.`);
        return false;
      }

      if (!item.quantity) {
        alert(`Preencha a quantidade do item ${i + 1}.`);
        return false;
      }

      if (!item.measure) {
        alert(`Selecione a medida do item ${i + 1}.`);
        return false;
      }
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const dietPayload = {
        patient_id: Number(form.patient_id),
        diet_type: form.diet_type || null,
        goal_weight: form.goal_weight || null,
        objective: form.objective || null,
        calories: Number(form.calories),
        proteins: Number(form.proteins),
        carbohydrates: Number(form.carbohydrates),
        fats: Number(form.fats),
        start_date: form.start_date,
        end_date: form.end_date,
        finalized_at: form.finalized_at || null,
      };

      const dietResponse = await api.post("/educators/diets", dietPayload);

      const createdDiet =
        dietResponse?.data?.data ||
        dietResponse?.data?.diet ||
        dietResponse?.data;

      const dietId =
        createdDiet?.id ||
        createdDiet?.diet_id ||
        dietResponse?.data?.id ||
        dietResponse?.data?.diet_id;

      if (!dietId) {
        console.error("Resposta da criação da dieta:", dietResponse?.data);
        throw new Error(
          "A dieta foi enviada, mas a API não retornou o ID da dieta criada."
        );
      }

      for (const item of items) {
        const itemPayload = {
          diet_id: Number(dietId),
          food_id: Number(item.food_id),
          meals_id: Number(item.meals_id),
          meal_time: item.meal_time,
          quantity: Number(item.quantity),
          measure: item.measure,
          others: item.others || null,
          send_notification: false,
          is_active: true,
        };

        await api.post("/educators/diet-items", itemPayload);
      }

      alert("Dieta cadastrada com sucesso!");
      nav("/dietas");
    } catch (error) {
      console.error("Erro ao cadastrar dieta:", error);
      console.error("Resposta backend:", error.response?.data);

      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Não foi possível cadastrar a dieta.";

      alert(apiMessage);
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center font-serif">
        <p className="text-[22px] text-[#2f2f2f]">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] font-serif px-6 py-6">
      <h1 className="text-center text-[44px] text-[#2f2f2f] mb-8">
        CADASTRO DE DIETA
      </h1>

      <form onSubmit={handleSubmit} className="max-w-[920px] mx-auto">
        <div className="bg-[#d9d9d9] rounded-[18px] px-10 py-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
            <div>
              <label className="block text-[18px] mb-1">Paciente</label>
              <select
                value={form.patient_id}
                onChange={(e) => setField("patient_id", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
                disabled={loadingPage}
              >
                <option value="">
                  {loadingPage ? "Carregando..." : "Selecione o paciente"}
                </option>
                {patients.map((patient) => (
                  <option
                    key={getPatientId(patient)}
                    value={getPatientId(patient)}
                  >
                    {getPatientName(patient)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[18px] mb-1">Objetivo</label>
              <input
                type="text"
                value={form.objective}
                onChange={(e) => setField("objective", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Calorias</label>
              <input
                type="number"
                value={form.calories}
                onChange={(e) => setField("calories", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Tipo de Dieta</label>
              <input
                type="text"
                value={form.diet_type}
                onChange={(e) => setField("diet_type", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Carboidratos</label>
              <input
                type="number"
                value={form.carbohydrates}
                onChange={(e) => setField("carbohydrates", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Proteínas</label>
              <input
                type="number"
                value={form.proteins}
                onChange={(e) => setField("proteins", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Gorduras</label>
              <input
                type="number"
                value={form.fats}
                onChange={(e) => setField("fats", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Peso Meta</label>
              <input
                type="text"
                value={form.goal_weight}
                onChange={(e) => setField("goal_weight", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div>
              <label className="block text-[18px] mb-1">Início da Dieta</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">Fim da Dieta</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setField("end_date", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-[18px] mb-1">
                Finalização da Dieta
              </label>
              <input
                type="date"
                value={form.finalized_at}
                onChange={(e) => setField("finalized_at", e.target.value)}
                className="w-full h-10 rounded-md px-3 outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#d9d9d9] rounded-[18px] px-10 py-8">
          <div className="space-y-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="border-b border-[#c4c4c4] pb-6 last:border-b-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
                  <div>
                    <label className="block text-[18px] mb-1">Refeição</label>
                    <select
                      value={item.meals_id}
                      onChange={(e) =>
                        updateItem(index, "meals_id", e.target.value)
                      }
                      className="w-full h-10 rounded-md px-3 outline-none bg-white"
                    >
                      <option value="">Tipo Refeição</option>
                      {meals.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[18px] mb-1">
                      Horário da Refeição
                    </label>
                    <input
                      type="time"
                      value={item.meal_time}
                      onChange={(e) =>
                        updateItem(index, "meal_time", e.target.value)
                      }
                      className="w-full h-10 rounded-md px-3 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[18px] mb-1">Alimento</label>
                    <select
                      value={item.food_id}
                      onChange={(e) =>
                        updateItem(index, "food_id", e.target.value)
                      }
                      className="w-full h-10 rounded-md px-3 outline-none bg-white"
                    >
                      <option value="">Selecionar Alimento</option>
                      {foods.map((food) => (
                        <option key={food.id} value={food.id}>
                          {food.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[18px] mb-1">
                      Und / Gr / Ml / L
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        className="w-full h-10 rounded-md px-3 outline-none bg-white"
                        placeholder="Quantidade"
                      />

                      <select
                        value={item.measure}
                        onChange={(e) =>
                          updateItem(index, "measure", e.target.value)
                        }
                        className="w-full h-10 rounded-md px-3 outline-none bg-white"
                      >
                        <option value="und">und</option>
                        <option value="gr">gr</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[18px] mb-1">Outro</label>
                    <input
                      type="text"
                      value={item.others}
                      onChange={(e) =>
                        updateItem(index, "others", e.target.value)
                      }
                      className="w-full h-10 rounded-md px-3 outline-none bg-[#bdbdbd] text-white placeholder:text-white/80"
                      placeholder="Outro"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="border border-red-500 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition"
                  >
                    Remover item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 w-10 h-10 rounded-full bg-black text-white text-[24px] flex items-center justify-center"
            title="Adicionar item"
          >
            +
          </button>

          <div className="flex flex-col md:flex-row justify-between gap-6 mt-14">
            <button
              type="button"
              onClick={() => nav("/dietas")}
              className="w-full md:w-[340px] h-12 rounded-md border border-[#23a046] text-[#23a046] text-[20px] hover:bg-[#eef9f0] transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-[340px] h-12 rounded-md bg-[#98cf9b] text-white text-[20px] hover:opacity-90 transition disabled:opacity-60"
            >
              {saving ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}