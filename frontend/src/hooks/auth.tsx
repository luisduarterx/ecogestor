import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  rankID: number;
};

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        router.push("/login");
        return;
      }
      try {
        const request = await fetch("http://localhost:4000/authenticate", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!request.ok) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/login");
          return;
        }

        const response = await request.json();
        setUser(response);
        console.log(response);
      } catch (error) {
        console.log("Erro na Requisiçao ao servidor!");
      }
    };
    verifyToken();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };
  return { user, isLoading, logout };
};
