import { Consulta } from "../types/types";

export function geraConsulta(
  sort: string | undefined,
  filter: string | undefined,
  page: number | string,
  limit: number | string
) {
  if (typeof page == "string") {
    page = parseInt(page);
  }
  if (typeof limit == "string") {
    limit = parseInt(limit);
  }

  const startIndex = (page - 1) * limit;

  const consulta: Consulta = {
    where: {},
    skip: startIndex,
    take: limit,
  };

  if (sort) {
    const [sortBy, sortDirection] = sort.split(":");
    const sortKeySeparada = sortBy.split(".");
    if (sortKeySeparada.length === 1) {
      consulta.orderBy = {
        [sortKeySeparada[0]]: sortDirection,
      };
    } else if (sortKeySeparada.length === 2) {
      consulta.orderBy = {
        [sortKeySeparada[0]]: {
          [sortKeySeparada[1]]: sortDirection,
        },
      };
    }
  }

  const filters = filter?.split(",");

  filters &&
    filters.forEach((filter) => {
      const [key, operador, value] = filter.split(/(=|:|>|<|>=|<=)/);
      if (operador == "=") {
        consulta.where[key] = tryParse(value);
      }
      if (operador == ":") {
        if (value === "null") {
          consulta.where[key] = {
            is: null,
          };
        } else if (value === "notNull") {
          consulta.where[key] = {
            isNot: null,
          };
        } else {
          const keySeparada = key.split(".");
          if (keySeparada.length === 1) {
            consulta.where[key] = {
              contains: value,
              mode: "insensitive",
            };
          } else if (keySeparada.length === 2) {
            consulta.where[keySeparada[0]] = {
              [keySeparada[1]]: {
                contains: value,
                mode: "insensitive",
              },
            };
          } else if (keySeparada.length === 3) {
            consulta.where[keySeparada[0]] = {
              [keySeparada[1]]: {
                [keySeparada[2]]: {
                  contains: value,
                  mode: "insensitive",
                },
              },
            };
          }
        }
      }
    });

  return [consulta, { ...consulta, skip: undefined, take: undefined }];
}

export function tryParse(value: any) {
  if (value.toLowerCase() === "true") {
    return true;
  } else if (value.toLowerCase() === "false") {
    return false;
  }

  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? value : parsedValue;
}
