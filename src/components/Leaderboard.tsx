import { Package, Trophy, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportLeaderboardToCSV } from "../utils/exportToCSV";
import { getLeaderboard } from "../utils/gameUtils";

interface Player {
  name: string;
  surname: string;
  company: string;
  email: string;
  score: number;
  level: number;
}

const Leaderboard: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = getLeaderboard();
    setLeaderboard(data);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError("First name is required");
      valid = false;
    } else {
      setNameError("");
    }

    if (!surname.trim()) {
      setSurnameError("Surname is required");
      valid = false;
    } else {
      setSurnameError("");
    }

    if (!company.trim()) {
      setCompanyError("Company is required");
      valid = false;
    } else {
      setCompanyError("");
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    if (valid) {
      const fullName = `${name} ${surname}`;
      sessionStorage.setItem("playerName", fullName);
      sessionStorage.setItem("playerSurname", surname);
      sessionStorage.setItem("playerCompany", company);
      sessionStorage.setItem("playerEmail", email);
      navigate("/game");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 bg-onyx text-white font-sans">
      <div className="max-w-md w-full bg-onyx rounded-lg shadow-lg ring-1 ring-midnight/70">
        <div className="bg-midnight p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <button
              type="button"
              onClick={() => exportLeaderboardToCSV(leaderboard)}
              className="hover:scale-110 transition-transform"
            >
              <Truck size={28} className="text-seafoam cursor-pointer" />
            </button>
            <span>Parcel Catcher</span>
          </h1>
          <Trophy className="text-seafoam" size={28} />
        </div>

        <div className="mb-6 bg-[#1a1f2eea] rounded-lg overflow-hidden p-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Top Delivery Drivers</h2>
          </div>

          {leaderboard.length > 0 ? (
            <div className="mb-6 bg-onyx rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-midnight">
                    <th className="py-1 px-2 text-left">Rank</th>
                    <th className="py-1 px-2 text-left">Name</th>
                    <th className="py-1 px-2 text-left">Company</th>
                    <th className="py-1 px-2 text-right">Score</th>
                    <th className="py-1 px-2 text-right">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr key={index} className="border border-seafoam">
                      <td className="py-1 px-2">{index + 1}</td>
                      <td className="py-1 px-2">{player.name}</td>
                      <td className="py-1 px-2">{player.company}</td>
                      <td className="py-1 px-2 text-right">{player.score}</td>
                      <td className="py-1 px-2 text-right">{player.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-onyx rounded-lg text-center">
              <Package className="mx-auto mb-2 text-seafoam" size={28} />
              <p>No high scores yet. Be the first!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Enter Your Details</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2 bg-onyx border rounded-md focus:outline-none focus:ring-2 focus:ring-seafoam ${
                  nameError ? "border-red-500" : "border-seafoam"
                }`}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-400">{nameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium mb-1"
              >
                Surname
              </label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className={`w-full p-2 bg-onyx border rounded-md focus:outline-none focus:ring-2 focus:ring-seafoam ${
                  surnameError ? "border-red-500" : "border-seafoam"
                }`}
              />
              {surnameError && (
                <p className="mt-1 text-sm text-red-400">{surnameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium mb-1"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`w-full p-2 bg-onyx border rounded-md focus:outline-none focus:ring-2 focus:ring-seafoam ${
                  companyError ? "border-red-500" : "border-seafoam"
                }`}
              />
              {companyError && (
                <p className="mt-1 text-sm text-red-400">{companyError}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2 bg-onyx border rounded-md focus:outline-none focus:ring-2 focus:ring-seafoam ${
                  emailError ? "border-red-500" : "border-seafoam"
                }`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-400">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-seafoam hover:bg-[#57d3d3] text-black font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Start Delivery
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
