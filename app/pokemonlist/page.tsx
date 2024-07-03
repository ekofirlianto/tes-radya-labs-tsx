"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LocalPlayIcon from "@mui/icons-material/LocalPlay";

interface Pokemon {
  name: string;
  url: string;
}

interface TableProps {
  data: Pokemon[];
}

interface PaginationProps {
  currentPage: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [hoveredPokemon, setHoveredPokemon] = useState<string | null>(null);
  const [isIconHovered, setIsIconHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${perPage}&offset=${
          (currentPage - 1) * perPage
        }`
      );
      const { results, count } = response.data;
      setPokemonList(results);
      setTotalItems(count);
    };

    fetchPokemon();
  }, [currentPage, perPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleMouseEnter = (pokemonName: string) => {
    setHoveredPokemon(pokemonName);
  };

  const handleMouseLeave = () => {
    setHoveredPokemon(null);
  };

  const Table: React.FC<TableProps> = ({ data }) => {
    return (
      <table className="table-auto w-full mx-auto border-collapse text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 text-black py-2 px-4">
              Name
            </th>
            <th className="border border-gray-400 text-black py-2 px-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((pokemon) => {
            const url = new URL(pokemon.url);
            const detail = url.pathname.split("/").filter(Boolean).pop();

            return (
              <tr key={pokemon.name} className="border-b border-gray-100">
                <td className="border border-gray-400 py-2 px-4 text-black">
                  {pokemon.name}
                </td>
                <td
                  className="border border-gray-400 py-2 px-4 relative"
                  onMouseEnter={() => handleMouseEnter(pokemon.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={`pokemonlist/${detail}`}
                    className="text-blue-500 hover:underline flex items-center justify-center relative"
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      className={`text-gray-500 text-lg border border-gray-400 p-1 rounded-md transition duration-300 ease-in-out ${
                        hoveredPokemon === pokemon.name
                          ? "text-blue-500 border-blue-500"
                          : ""
                      }`}
                    />
                    {hoveredPokemon === pokemon.name && (
                      <span className="absolute bg-gray-800 text-white text-xs rounded-md py-1 px-2 top-4 left-16.5 transform translate-x-full -translate-y-full transition duration-300 ease-in-out pointer-events-none">
                        Detail
                      </span>
                    )}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    perPage,
    totalItems,
    onPageChange,
  }) => {
    const totalPages = Math.ceil(totalItems / perPage);

    const renderPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 5;
      let startPage = currentPage;

      if (totalPages <= maxPagesToShow) {
        startPage = 1;
      } else if (currentPage <= Math.floor(maxPagesToShow / 2)) {
        startPage = 1;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
      }

      for (let i = 0; i < maxPagesToShow && startPage <= totalPages; i++) {
        pageNumbers.push(startPage);
        startPage++;
      }

      return pageNumbers.map((page) => (
        <button
          key={page}
          className={`${
            page === currentPage
              ? "bg-blue-500 text-black"
              : "bg-gray-300 text-black hover:bg-gray-400 hover:text-gray-900"
          } mb-4 py-2 px-4 rounded-md mx-1`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ));
    };

    return (
      <div className="pagination flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-gray-900 py-2 px-4 rounded-md mb-4 mr-2"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <button
            className="bg-gray-300 text-black hover:bg-gray-400 hover:text-gray-900 py-2 px-4 rounded-md mb-4 ml-2"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto bg-white">
      <div className="flex items-center justify-center my-4 relative">
        <h1 className="text-3xl font-bold text-black">Pokemon List</h1>
        <Link href="/mypokemon" legacyBehavior>
          <a
            className="flex items-center ml-20 relative"
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
          >
            <LocalPlayIcon
              className={`text-5xl transition duration-300 ease-in-out ${
                isIconHovered ? "text-blue-500" : "text-gray-500"
              }`}
            />
            {isIconHovered && (
              <span className="absolute bg-gray-800 text-white text-xs rounded-md py-1 px-5 left-full top-1/2 transform -translate-y-1/2 ml-2">
                My Pokemon
              </span>
            )}
          </a>
        </Link>
      </div>
      <div className="max-w-screen-md mx-auto">
        <Table data={pokemonList} />
      </div>
      <Pagination
        currentPage={currentPage}
        perPage={perPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PokemonList;
