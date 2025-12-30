import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { toast } from "sonner";
import { ArrowLeft, User, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const ChildSetup = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [childData, setChildData] = useState({
    name: "",
    age: "",
    grade: ""
  });

  const handleSubmit = async () => {
    if (!childData.name || !childData.age || !childData.grade) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/children`, {
        name: childData.name,
        age: parseInt(childData.age),
        grade: parseInt(childData.grade)
      }, { withCredentials: true });

      toast.success(`¡Perfil de ${childData.name} creado!`);
      navigate("/parent");
    } catch (error) {
      console.error("Error creating child:", error);
      toast.error("Error al crear el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] child-theme">
      {/* Floating shapes */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate("/parent")}
          className="text-[#2B2D42]"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold text-[#2B2D42] mb-2"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Añadir perfil
          </h1>
          <p className="text-[#8D99AE]">
            Configura el perfil de tu hijo para personalizar su experiencia
          </p>
        </div>

        <div className="card-clay">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-[#4CC9F0] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-black" />
              </div>
              <h2 
                className="text-xl font-bold text-center text-[#2B2D42] mb-6"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                ¿Cómo se llama?
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#2B2D42] font-medium">
                    Nombre o apodo
                  </Label>
                  <Input
                    id="name"
                    data-testid="child-name-input"
                    value={childData.name}
                    onChange={(e) => setChildData({ ...childData, name: e.target.value })}
                    placeholder="Ej: María, Pepe, Luna..."
                    className="mt-2 border-2 border-[#2B2D42] rounded-xl h-12 text-lg"
                  />
                </div>
                <Button
                  data-testid="next-step-btn"
                  onClick={() => childData.name && setStep(2)}
                  disabled={!childData.name}
                  className="w-full btn-clay h-14 text-lg"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Age & Grade */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-[#FFD60A] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
              <h2 
                className="text-xl font-bold text-center text-[#2B2D42] mb-6"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                ¿Qué curso hace {childData.name}?
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="age" className="text-[#2B2D42] font-medium">
                    Edad
                  </Label>
                  <Select
                    value={childData.age}
                    onValueChange={(value) => setChildData({ ...childData, age: value })}
                  >
                    <SelectTrigger 
                      data-testid="age-select"
                      className="mt-2 border-2 border-[#2B2D42] rounded-xl h-12"
                    >
                      <SelectValue placeholder="Selecciona edad" />
                    </SelectTrigger>
                    <SelectContent>
                      {[6, 7, 8, 9, 10, 11, 12].map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} años
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grade" className="text-[#2B2D42] font-medium">
                    Curso
                  </Label>
                  <Select
                    value={childData.grade}
                    onValueChange={(value) => setChildData({ ...childData, grade: value })}
                  >
                    <SelectTrigger 
                      data-testid="grade-select"
                      className="mt-2 border-2 border-[#2B2D42] rounded-xl h-12"
                    >
                      <SelectValue placeholder="Selecciona curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          {grade}º de Primaria
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    data-testid="back-step-btn"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-2 border-[#2B2D42] rounded-xl"
                  >
                    Atrás
                  </Button>
                  <Button
                    data-testid="create-child-btn"
                    onClick={handleSubmit}
                    disabled={!childData.age || !childData.grade || loading}
                    className="flex-1 btn-clay h-12"
                  >
                    {loading ? "Creando..." : "Crear perfil"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChildSetup;
