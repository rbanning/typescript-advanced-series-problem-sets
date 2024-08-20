import fs from 'fs/promises';



export type RawDataSource = string[];
export type Method = 'file' | 'url';
export type Options = {
  removeBlankLines: boolean;
}
const defaultOptions: Options = {
  removeBlankLines: false,
}

export async function fetchData(method: Method, source: string, options?: Partial<Options>): Promise<RawDataSource> {
  options = { ...defaultOptions, ...options };

  let data: RawDataSource = [];
  switch(method) {
    case 'file':
      data = await fetchDataFromFS(source);
      break;
    case 'url':
      data = await fetchDataFromRemote(source);
      break;
    default: 
      throw new Error(`fetchData had not implemented the data method: ${method}`);
  }

  if (options.removeBlankLines) {
    return data.filter(line => line.trim().length > 0);
  }
  //else
  return data;
}


async function fetchDataFromFS(path: string) : Promise<RawDataSource> {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8'});
    return stringToRawDataSource(data); 
  } catch (error) {
    console.warn("fetchDataFromFS failed", {path, error});
    throw 'fetchData failed';
  }
}

async function fetchDataFromRemote(url: string) : Promise<RawDataSource> {
  let resp: Response | null = null;
  try {
    resp = await fetch(url, { method: 'GET' });
    if (resp.ok) {
      const contentType = resp.headers.get("content-type");
      if (contentType && contentType.indexOf('application/json') >= 0) {
        const json = await resp.json();
        if (Array.isArray(json)) { return json; }
        else if (typeof(json) === 'string') {
          return stringToRawDataSource(json);
        }      
        else {
          throw new Error(`Invalid JSON response from remote`);
        }
      }
      else {
        const data = await resp.text();
        return stringToRawDataSource(data);
      }
    } else {
      throw new Error(`Error response - status: ${resp.status} - ${resp.statusText}`);
    }  
  } catch (error) {
    console.warn("fetchDataFromRemote failed", {url, resp, error});
    throw 'fetchData failed';  
  }
}


function stringToRawDataSource(text: string): RawDataSource {
  return text.split('\n').map(m => m.replace('\r', ''));  //remove CRLF extra bits
}