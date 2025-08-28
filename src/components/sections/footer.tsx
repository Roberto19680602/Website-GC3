"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2A3440]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="max-w-xl mx-auto">
          <form className="flex flex-col items-center space-y-4">
            <label htmlFor="name" className="sr-only">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nombre"
              className="w-full bg-white border border-white rounded-none p-3 h-12 text-black placeholder:text-gray-500 focus:outline-none"
            />
            <label htmlFor="message" className="sr-only">
              Mensaje
            </label>
            <textarea
              id="message"
              placeholder="Quiero unirme a la lista de correo."
              rows={4}
              className="w-full bg-white border border-white rounded-none p-3 text-black placeholder:text-gray-500 resize-none focus:outline-none"
            />
            <div className="flex items-center self-start pt-2 w-full">
              <input
                id="privacy-policy"
                type="checkbox"
                className="appearance-none h-5 w-5 border border-white bg-transparent shrink-0"
              />
              <label
                htmlFor="privacy-policy"
                className="ml-3 text-sm text-white cursor-pointer"
              >
                Acepto la política de privacidad.
              </label>
            </div>
            <button
              type="submit"
              className="text-white text-lg hover:underline py-4"
            >
              Suscribirse Ahora
            </button>
          </form>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-white">
          <div className="flex justify-center md:justify-start">
            <div className="flex flex-col sm:flex-row gap-x-12 gap-y-2 text-center sm:text-left text-sm">
              <div className="flex flex-col space-y-2">
                <a href="#" className="hover:underline">
                  No Vender Mi Información Personal
                </a>
                <a href="#" className="hover:underline">
                  Política de Privacidad
                </a>
                <a href="#" className="hover:underline">
                  Política de Precios
                </a>
              </div>
              <div className="flex flex-col space-y-2">
                <a href="#" className="hover:underline">
                  Términos de Uso
                </a>
                <a href="#" className="hover:underline">
                  Política de Cancelación/Reembolso
                </a>
              </div>
            </div>
          </div>
          <div className="text-center">
            <a
              href="mailto:info@gc3consultoria.com"
              className="text-xl font-bold hover:underline"
            >
              Contáctanos
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">© 2024 por GC3 Consultoría</p>
          </div>
        </div>
      </div>
      <div
        className="h-10 w-full"
        style={{ backgroundColor: "var(--color-brand-primary)" }}
      ></div>
    </footer>
  );
};

export default Footer;