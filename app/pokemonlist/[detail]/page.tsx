"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
  name: string; // Added name property to extend type information
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
}

interface DetailProps {
  params: {
    detail: string;
  };
}

const Detail: React.FC<DetailProps> = ({ params }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${params.detail}`
        );
        const pokemonData = response.data;

        // Fetch additional type information
        const typeResponses = await Promise.all(
          pokemonData.types.map((type: PokemonType) => axios.get(type.type.url))
        );
        const typesData = typeResponses.map((res) => res.data);

        // Update pokemon state with types data
        const typesWithNames = typesData.map(
          (typeData: any, index: number) => ({
            ...pokemonData.types[index],
            name: typeData.name,
          })
        );

        setPokemon({
          ...pokemonData,
          types: typesWithNames,
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [params.detail]);

  const handleSaveToLocalStorage = () => {
    // Ambil data yang sudah ada di localStorage
    const existingPokemonData = JSON.parse(
      localStorage.getItem("my-pokemon") || "[]"
    );

    // Periksa apakah pokemon sudah ada di dalam daftar sebelumnya
    const isPokemonExists = existingPokemonData.find(
      (item: Pokemon) => item.name === pokemon?.name
    );

    if (!isPokemonExists) {
      // Tambahkan pokemon baru ke dalam array yang sudah ada
      const updatedPokemonData = [...existingPokemonData, pokemon];

      // Simpan kembali ke localStorage
      localStorage.setItem("my-pokemon", JSON.stringify(updatedPokemonData));
      window.alert("Data tersimpan di My Pokemon!");
    } else {
      window.alert("Pokemon sudah ada di My Pokemon!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-4">{pokemon?.name}</h1>
      <img
        src={pokemon?.sprites.front_default}
        alt={pokemon?.name}
        className="w-48 h-48 mb-4"
      />

      <table className="w-full max-w-md border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Types</td>
            <td className="px-4 py-2">
              <ul className="list-disc list-inside">
                {pokemon?.types.map((typeInfo, index) => (
                  <li key={index}>{typeInfo.name}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Stats</td>
            <td className="px-4 py-2">
              <ul className="list-disc list-inside">
                {pokemon?.stats.map((statInfo, index) => (
                  <li key={index}>
                    {statInfo.stat.name}: {statInfo.base_stat}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Abilities</td>
            <td className="px-4 py-2">
              <ul className="list-disc list-inside">
                {pokemon?.abilities.map((abilityInfo, index) => (
                  <li key={index}>
                    {abilityInfo.ability.name}{" "}
                    {abilityInfo.is_hidden && "(Hidden)"}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Height</td>
            <td className="px-4 py-2">{pokemon?.height}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-semibold">Weight</td>
            <td className="px-4 py-2">{pokemon?.weight}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={handleSaveToLocalStorage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <StarIcon className="mr-2" /> Simpan ke My Pokemon
        </button>
        <div className="mb-5"></div>
        <Link href="/">
          <span className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
            Back
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Detail;
