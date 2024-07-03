"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: { name: string }[];
  stats: { stat: { name: string }; base_stat: number }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  height: number;
  weight: number;
}

const MyPokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  useEffect(() => {
    // Retrieve saved Pokemon data from localStorage
    const savedPokemon = JSON.parse(localStorage.getItem("my-pokemon") || "[]");
    setPokemonList(savedPokemon);
  }, []);

  const handleDeletePokemon = (pokemonName: string) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm(`Are you sure you want to delete ${pokemonName}?`)) {
      // Hapus pokemon dari localStorage
      const updatedPokemonList = pokemonList.filter(
        (pokemon) => pokemon.name !== pokemonName
      );

      // Simpan kembali ke localStorage
      localStorage.setItem("my-pokemon", JSON.stringify(updatedPokemonList));

      // Update state
      setPokemonList(updatedPokemonList);

      // Toast notification after successful deletion
      toast.success(`Successfully deleted ${pokemonName} from My Pokemon!`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-4">My Pokemon</h1>
      {pokemonList.length === 0 ? (
        <p className="text-xl">You haven't saved any Pokemon yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pokemonList.map((pokemon, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{pokemon.name}</h2>
                <p className="mb-2">
                  Types: {pokemon.types.map((type) => type.name).join(", ")}
                </p>
                <p className="mb-2">
                  Abilities:{" "}
                  {pokemon.abilities
                    .map((ability) =>
                      ability.is_hidden
                        ? `${ability.ability.name} (Hidden)`
                        : ability.ability.name
                    )
                    .join(", ")}
                </p>
                <p>
                  <Link href={`/pokemonlist/${pokemon.name.toLowerCase()}`}>
                    <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                      View Details
                    </span>
                  </Link>
                </p>
                <button
                  onClick={() => handleDeletePokemon(pokemon.name)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Link href="/">
          <span className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded cursor-pointer">
            Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MyPokemonList;
