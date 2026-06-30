class Biblioteca:
    def cadastrar_livro(self, titulo, autor, quantidade, disponivel):
        if not self.__dict__:
            novo_id = 1
        else:
            ultimo_id = next(reversed(self.__dict__))
            novo_id = ultimo_id + 1

        self.__dict__[novo_id] = {
            "titulo": titulo,
            "autor": autor,
            "quantidade": quantidade,
            "disponivel": disponivel
        }

    def listar_todos_os_livros(self):
        dados = self.__dict__

        print(f"{'ID':<5}{'TITULO':<20}{'AUTOR':<25}{'QTD':<10}{'DISPONIVEL'}")
        print("-" * 70)

        for id, info in dados.items():
            print(f"{id:<5}{info['titulo']:<20}{info['autor']:<25}{info['quantidade']:<10}{info['disponivel']}")

    def emprestar_livro(self, id):
        if id in self.__dict__:
            if self.__dict__[id]["quantidade"] > 0:
                self.__dict__[id]["quantidade"] -= 1

                if self.__dict__[id]["quantidade"] == 0:
                    self.__dict__[id]["disponivel"] = False
            else:
                print("Livro indisponível")
        else:
            print("ID não encontrado")

    def devolver_livro(self, id):
        if id in self.__dict__:
            livro = self.__dict__[id]
            livro["quantidade"] += 1
            livro["disponivel"] = True
        else:
            print("ID não encontrado")

class Main:
    def __init__(self, biblioteca):
        self.biblioteca = biblioteca

    def menu(self):
        while True:
            print("\n------------------------------")
            print("        MENU BIBLIOTECA")
            print("------------------------------")
            print("[ 1 ] Cadastrar livro")
            print("[ 2 ] Listar todos os livros")
            print("[ 3 ] Emprestar livro")
            print("[ 4 ] Devolver livro")
            print("[ 5 ] Sair")

            opcao = input("Escolha: ")

            if opcao == "1":
                print("\n------------------------------")
                print("        CADASTRO")
                print("------------------------------")
                titulo = input("Título: ")
                autor = input("Autor: ")
                quantidade = int(input("Quantidade: "))
                self.biblioteca.cadastrar_livro(titulo, autor, quantidade, True)

            elif opcao == "2":
                print("\n------------------------------")
                print("        TABELA")
                print("------------------------------")
                self.biblioteca.listar_todos_os_livros()

            elif opcao == "3":
                print("\n------------------------------")
                print("        EMPRESTIMO DE LIVRO")
                print("------------------------------")
                print("Livros disponíveis:")
                self.biblioteca.listar_todos_os_livros()
                id = int(input("ID: "))
                self.biblioteca.emprestar_livro(id)

            elif opcao == "4":
                print("\n------------------------------")
                print("        DEVOLUÇÃO DE LIVRO")
                print("------------------------------")
                print("Tabela de livros:")
                self.biblioteca.listar_todos_os_livros()
                id = int(input("ID: "))
                self.biblioteca.devolver_livro(id)

            elif opcao == "5":
                print("Saindo...")
                break

            else:
                print("Opção inválida")


b = Biblioteca()
app = Main(b)
app.menu()